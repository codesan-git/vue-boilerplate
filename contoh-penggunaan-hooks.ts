// contoh-penggunaan-hooks.ts
import { ref, computed } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import {
  usePublicApiQuery,
  useAuthApiQuery,
  usePublicPost,
  useAuthPut,
  useAuthDelete
} from './src/service/useApiQuery';

// ========================
// 1. Tipe Data Contoh
// ========================
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CreateProductDto {
  name: string;
  price: number;
  description?: string;
  category: string;
}

interface UpdateProductDto {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  category?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ========================
// 2. Contoh Komponen Vue
// ========================

export function useProductManagement() {
  const queryClient = useQueryClient();
  const selectedProductId = ref<string | null>(null);
  const searchQuery = ref('');

  // 2.1 Mengambil daftar produk (publik)
  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = usePublicApiQuery<ApiResponse<Product[]>>(
    ['products', { search: searchQuery }], // Query key dengan parameter
    '/products',
    {
      // Opsional: Hanya fetch jika ada minimal 2 karakter
      enabled: searchQuery.value.length > 1,
      // Opsional: Waktu cache 5 menit
      staleTime: 1000 * 60 * 5,
    }
  );

  // 2.2 Mengambil detail produk (publik)
  const {
    data: productDetail,
    isLoading: isLoadingProductDetail
  } = usePublicApiQuery<Product>(
    ['product', selectedProductId],
    `/products/${selectedProductId.value}`,
    {
      // Hanya fetch jika ada selectedProductId
      enabled: !!selectedProductId.value,
    }
  );

  // 2.3 Mengambil data user (perlu auth)
  const userId = ref('user-123'); // Biasanya dari store/auth
  const {
    data: userProfile,
    isError: isUserError
  } = useAuthApiQuery<User>(
    ['user', userId],
    `/users/${userId.value}`
  );

  // 2.4 Mutasi: Membuat produk baru (publik)
  const {
    mutate: createProduct,
    isPending: isCreatingProduct,
    error: createError
  } = usePublicPost<Product, Error, CreateProductDto>(
    '/products',
    {
      onSuccess: () => {
        console.log('Produk berhasil dibuat!');
        // Refresh daftar produk
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (error) => {
        console.error('Gagal membuat produk:', error);
      }
    }
  );

  // 2.5 Mutasi: Update produk (perlu auth)
  const {
    mutate: updateProduct,
    isPending: isUpdatingProduct
  } = useAuthPut<Product, Error, UpdateProductDto>(
    (variables) => `/products/${variables.id}`,
    {
      onSuccess: (data, variables) => {
        console.log('Produk berhasil diupdate:', data);
        // Update cache secara manual untuk menghindari refetch
        queryClient.setQueryData(['product', variables.id], data);
        // Invalidate query daftar produk
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
      onError: (error) => {
        console.error('Gagal mengupdate produk:', error);
      }
    }
  );

  // 2.6 Mutasi: Hapus produk (perlu auth)
  const {
    mutate: deleteProduct,
    isPending: isDeletingProduct
  } = useAuthDelete<{ success: boolean }, Error, { id: string }>(
    (variables) => `/products/${variables.id}`,
    {
      // Optimistic update
      onMutate: async (variables) => {
        // Batalkan query yang sedang berjalan
        await queryClient.cancelQueries({ queryKey: ['products'] });

        // Simpan data sebelumnya untuk rollback
        const previousProducts = queryClient.getQueryData<ApiResponse<Product[]>>(['products']);

        // Update cache dengan menghapus item
        if (previousProducts?.data) {
          queryClient.setQueryData(
            ['products'],
            {
              ...previousProducts,
              data: previousProducts.data.filter(p => p.id !== variables.id)
            }
          );
        }

        return { previousProducts };
      },
      // Jika error, rollback
      onError: (err, variables, context) => {
        if (context?.previousProducts) {
          queryClient.setQueryData(['products'], context.previousProducts);
        }
      },
      // Selalu refetch setelah error atau sukses
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    }
  );

  // 2.7 Contoh fungsi untuk memanggil mutasi
  const handleCreateProduct = (productData: CreateProductDto) => {
    createProduct(productData);
  };

  const handleUpdateProduct = (productData: UpdateProductDto) => {
    updateProduct(productData);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteProduct({ id: productId });
    }
  };

  // 2.8 Computed properties
  const filteredProducts = computed(() => {
    if (!products.value?.data?.data) return [];
    return products.value.data.data.filter((product: Product) =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const currentPage = ref(1);
  const itemsPerPage = 10;

  // Computed property for paginated data
  const paginatedProducts = computed(() => {
    if (!filteredProducts.value) return [];
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.value.slice(start, end);
  });

  // Function to change page
  const changePage = (page: number) => {
    currentPage.value = page;
    // Optional: Fetch new data for the page if using server-side pagination
    // fetchProducts({ page, limit: itemsPerPage });
  };

  return {
    // State
    products: paginatedProducts,
    productDetail: computed(() => productDetail.value?.data),
    userProfile: computed(() => userProfile.value?.data),
    isLoadingProducts,
    isLoadingProductDetail,
    isCreatingProduct,
    isUpdatingProduct,
    isDeletingProduct,
    productsError,
    isUserError,
    createError,
    currentPage,
    itemsPerPage,
    totalItems: computed(() => products.value?.meta?.total || 0),
    totalPages: computed(() => products.value?.meta?.totalPages || 1),

    // Methods
    refetchProducts,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    changePage,
    selectProduct: (id: string) => { selectedProductId.value = id; },
    setSearchQuery: (query: string) => {
      searchQuery.value = query;
      currentPage.value = 1;
    }
  };
}

// ========================
// 3. Contoh Penggunaan di Komponen Vue
// ========================
/*
<template>
  <div>
    <!-- Form Pencarian -->
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        @input="setSearchQuery($event.target.value)"
        placeholder="Cari produk..."
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingProducts">Memuat produk...</div>
    
    <!-- Error State -->
    <div v-else-if="productsError" class="error">
      Gagal memuat produk: {{ productsError.message }}
    </div>

    <!-- Daftar Produk -->
    <div v-else class="product-list">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="product-item"
        @click="selectProduct(product.id)"
      >
        <h3>{{ product.name }}</h3>
        <p>Harga: {{ formatCurrency(product.price) }}</p>
        <button @click.stop="handleDeleteProduct(product.id)" :disabled="isDeletingProduct">
          Hapus
        </button>
      </div>
    </div>

    <!-- Detail Produk -->
    <div v-if="productDetail" class="product-detail">
      <h2>Detail Produk</h2>
      <form @submit.prevent="handleUpdateProduct(updatedProduct)">
        <input v-model="updatedProduct.name" placeholder="Nama Produk">
        <input v-model.number="updatedProduct.price" type="number" placeholder="Harga">
        <button type="submit" :disabled="isUpdatingProduct">
          {{ isUpdatingProduct ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProductManagement } from './contoh-penggunaan-hooks';

const {
  products,
  productDetail,
  isLoadingProducts,
  isUpdatingProduct,
  isDeletingProduct,
  productsError,
  selectProduct,
  handleDeleteProduct,
  handleUpdateProduct,
  setSearchQuery
} = useProductManagement();

const searchQuery = ref('');
const updatedProduct = ref({
  id: '',
  name: '',
  price: 0,
  category: ''
});

// Update form ketika productDetail berubah
watch(productDetail, (newProduct) => {
  if (newProduct) {
    updatedProduct.value = { ...newProduct };
  }
}, { immediate: true });

// Format mata uang
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};
</script>
*/

// ========================
// 4. Contoh Penggunaan Lainnya
// ========================

// 4.1 Contoh penggunaan di komponen lain
/*
// ProductForm.vue - Contoh form untuk membuat produk baru
const { mutate: createProduct, isLoading } = usePublicPost<Product, Error, CreateProductDto>(
  '/products',
  {
    onSuccess: () => {
      // Reset form
      formData.value = { name: '', price: 0, category: '' };
      // Tampilkan notifikasi
      showToast('Produk berhasil ditambahkan!', 'success');
    },
    onError: (error) => {
      showToast(`Gagal menambahkan produk: ${error.message}`, 'error');
    }
  }
);
*/

// 4.2 Contoh dengan autentikasi
/*
// UserProfile.vue - Mengupdate profil user
const { mutate: updateProfile, isLoading: isUpdating } = useAuthPut<User, Error, Partial<User>>(
  (variables) => `/users/${variables.id}`,
  {
    onSuccess: (updatedUser) => {
      // Update user di store/state
      userStore.setUser(updatedUser);
      showToast('Profil berhasil diperbarui', 'success');
    }
  }
);
*/

// 4.3 Contoh dengan pagination lengkap
/*
const page = ref(1);
const limit = 10;

const { 
  data: paginatedResponse,
  isFetching,
  error: paginationError 
} = usePublicApiQuery<ApiResponse<Product[]>>(
  ['products', { page: page.value, limit }],
  `/products?page=${page.value}&limit=${limit}`,
  {
    keepPreviousData: true, // Untuk UX yang lebih baik saat pindah halaman
    staleTime: 5 * 60 * 1000, // 5 menit
  }
);

// Fungsi untuk ganti halaman
const goToPage = (newPage: number) => {
  page.value = newPage;
};
*/

// ========================
// 5. Tips Penggunaan
// ========================
/*
1. Gunakan query keys yang deskriptif dan konsisten
2. Manfaatkan enabled untuk conditional fetching
3. Gunakan staleTime untuk optimasi performa
4. Manfaatkan onSuccess/onError untuk menangani side effects
5. Gunakan invalidateQueries untuk memperbarui data setelah mutasi
6. Pertimbangkan menggunakan optimistic updates untuk UX yang lebih baik
7. Tangani loading dan error states dengan baik di UI
*/

// ========================
// 6. Error Handling
// ========================
/*
// Contoh error handling yang lebih baik
const { data, error } = usePublicApiQuery<Product[]>(
  ['products'],
  '/products',
  {
    retry: 2, // Ulangi maksimal 2 kali jika gagal
    onError: (error) => {
      // Log error ke layanan monitoring
      logErrorToService(error);
      // Tampilkan notifikasi ke pengguna
      showErrorNotification('Gagal memuat daftar produk');
    }
  }
);
*/

// ========================
// 7. Testing
// ========================
/*
// Contoh pengujian dengan Vitest
import { renderHook, waitFor } from '@testing-library/vue';
import { useProductManagement } from './contoh-penggunaan-hooks';
import { vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

// Mock API client atau gunakan MSW (Mock Service Worker)
// untuk menangani request HTTP

describe('useProductManagement', () => {
  it('should fetch products', async () => {
    const { result } = renderHook(() => useProductManagement(), {
      global: {
        plugins: [createTestingPinia()]
      }
    });

    await waitFor(() => {
      expect(result.current.isLoadingProducts).toBe(false);
    });

    expect(result.current.products).toHaveLength(3);
    expect(result.current.products?.[0].name).toBe('Produk Contoh');
  });
});
*/

// ========================
// 8. Type Safety
// ========================
/*
// Pastikan untuk selalu mendefinisikan tipe dengan benar
interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Contoh dengan tipe yang lebih ketat
interface ProductResponse extends ApiResponse<Product> {
  metadata: {
    page: number;
    total: number;
    limit: number;
  };
}
*/

export { }; // Pastikan file ini adalah module
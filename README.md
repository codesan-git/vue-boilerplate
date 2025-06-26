# Sanify Frontend

> Boilerplate Vue 3 dengan TypeScript, Pinia, dan Vue Query
>
> Email: [satrianugrahacode@gmail.com]  
> GitHub: [codesan-git](https://github.com/codesan-git)

Proyek frontend menggunakan Vue 3, TypeScript, dan ekosistem modern lainnya.

## 🚀 Teknologi Utama

- ⚡ [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- 🎨 [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- 🗃️ [Pinia](https://pinia.vuejs.org/) - State Management
- 🔄 [Vue Query](https://tanstack.com/query/latest) - Data Fetching & Caching
- 🛣️ [Vue Router](https://router.vuejs.org/) - Official Router for Vue.js
- 🎨 [Nuxt UI](https://ui.nuxt.com/) - UI Component Library
- 🛡️ [Zod](https://zod.dev/) - Schema Validation
- 📡 [Axios](https://axios-http.com/) - HTTP Client

## 📁 Struktur Folder

```
src/
├── assets/           # Aset statis (gambar, font, dll)
├── components/       # Komponen yang dapat digunakan kembali
│   ├── forms/       # Komponen form
│   ├── layout/      # Komponen tata letak
│   └── ui/          # Komponen UI dasar
├── composables/     # Composable functions
├── router/          # Konfigurasi routing
├── service/         # API services
│   ├── apiClient.ts # HTTP client terkonfigurasi
│   └── useApiQuery.ts # Custom hook untuk API query
├── stores/          # State management dengan Pinia
│   └── modules/    # Modul-modul store
├── views/           # Halaman/route views
├── App.vue          # Root component
└── main.ts          # Entry point aplikasi
```

## ⚙️ Konfigurasi Lingkungan

Buat file `.env` di root project dan salin isi dari `.env.example`:

```bash
cp .env.example .env
```

Isi file `.env`:

```env
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

## 🛠️ Instalasi

1. Clone repositori

   ```bash
   git clone [repo-url]
   cd cp-umnp
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Setup environment

   ```bash
   cp .env.example .env
   # Edit .env sesuai kebutuhan
   ```

4. Jalankan development server
   ```bash
   bun run dev
   ```

## 📦 Script

- `bun run dev` - Menjalankan development server
- `bun run build` - Build untuk produksi
- `bun run preview` - Preview build produksi

## � API Client

Proyek ini menggunakan Axios dengan konfigurasi default yang sudah disiapkan di `src/service/apiClient.ts`. Berikut contoh penggunaannya:

```typescript
import apiClient from "@/service/apiClient";

// Contoh GET request
const fetchUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

// Contoh POST request dengan data
const createUser = async (userData) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};
```

## 🔧 Dependencies

### Utama

| Package               | Version  | Deskripsi                        |
| --------------------- | -------- | -------------------------------- |
| `vue`                 | ^3.5.17  | Progressive JavaScript Framework |
| `pinia`               | ^3.0.3   | State Management                 |
| `vue-router`          | ^4.5.1   | Official Router                  |
| `@tanstack/vue-query` | ^5.81.2  | Data Fetching                    |
| `axios`               | ^1.10.0  | HTTP Client                      |
| `zod`                 | ^3.25.67 | Schema Validation                |
| `@nuxt/ui`            | ^3.1.3   | UI Component Library             |

### Development

| Package      | Version | Deskripsi     |
| ------------ | ------- | ------------- |
| `typescript` | ~5.8.3  | TypeScript    |
| `vite`       | ^7.0.0  | Build Tool    |
| `vue-tsc`    | ^2.2.10 | Type Checking |

## 🌟 Fitur

- 🎯 Vue 3 dengan Composition API
- 🛡️ TypeScript untuk type safety
- 🗃️ State Management dengan Pinia
- 🔄 Data Fetching dengan Vue Query
- 🎨 UI Komponen dengan Nuxt UI
- 📱 Responsive Design
- 🛣️ Routing dengan Vue Router
- 🔌 HTTP Client dengan Axios
- 🔒 Environment Configuration

## 🤝 Berkontribusi

1. Fork project
2. Buat branch (`git checkout -b fitur/namafitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur'`)
4. Push ke branch (`git push origin fitur/namafitur`)
5. Buat Pull Request

## 📜 Lisensi

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

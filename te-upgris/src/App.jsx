import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Profil from './pages/Profil.jsx'
import Akademik from './pages/Akademik.jsx'
import Dosen from './pages/Dosen.jsx'
import Penelitian from './pages/Penelitian.jsx'
import PenelitianDetail from './pages/PenelitianDetail.jsx'
import Pengumuman from './pages/Pengumuman.jsx'
import PengumumanDetail from './pages/PengumumanDetail.jsx'
import Berita from './pages/Berita.jsx'
import BeritaDetail from './pages/BeritaDetail.jsx'
import Capstone from './pages/Capstone.jsx'
import CapstoneDetail from './pages/CapstoneDetail.jsx'
import SPMI from './pages/SPMI.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/akademik" element={<Akademik />} />
          <Route path="/dosen" element={<Dosen />} />
          <Route path="/penelitian" element={<Penelitian />} />
          <Route path="/penelitian/:id" element={<PenelitianDetail />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/pengumuman/:id" element={<PengumumanDetail />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<BeritaDetail />} />
          <Route path="/capstone" element={<Capstone />} />
          <Route path="/capstone/:id" element={<CapstoneDetail />} />
          <Route path="/spmi" element={<SPMI />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

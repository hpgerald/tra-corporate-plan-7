import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Debug from './pages/Debug.jsx'
import Design from './pages/Design.jsx'
import Plan from './pages/Plan.jsx'
import KpaDetail from './pages/KpaDetail.jsx'
import ObjectiveDetail from './pages/ObjectiveDetail.jsx'
import Targets from './pages/Targets.jsx'
import Timeline from './pages/Timeline.jsx'
import WhatItMeans from './pages/WhatItMeans.jsx'
import Data from './pages/Data.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plan" element={<Plan />} />
      <Route path="/plan/:kpaId" element={<KpaDetail />} />
      <Route path="/objective/:objId" element={<ObjectiveDetail />} />
      <Route path="/targets" element={<Targets />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/what-it-means" element={<WhatItMeans />} />
      <Route path="/data" element={<Data />} />
      <Route path="/about" element={<About />} />
      <Route path="/debug" element={<Debug />} />
      <Route path="/design" element={<Design />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

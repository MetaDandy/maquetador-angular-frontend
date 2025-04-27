import { HashRouter, Routes, Route } from 'react-router-dom';
import StudioEditor from '../studio_editor';

export default function StudioRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path=":pageId/*" element={<StudioEditor />} />
      </Routes>
    </HashRouter>
  );
}

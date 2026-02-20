import FeaturedWorkGallery3D from '../components/FeaturedWorkGallery3D';

/**
 * FeaturedWork section — now wraps the 3D gallery.
 *
 * The gallery component handles its own scroll pinning, title, and card
 * rendering. This wrapper just marks the section boundary for page nav.
 *
 * To change gallery items, edit the WORK_ITEMS array inside
 * FeaturedWorkGallery3D.tsx.
 */
export default function FeaturedWork() {
  return (
    <section className="relative">
      <FeaturedWorkGallery3D />
    </section>
  );
}

import dynamic from 'next/dynamic';

const NextReactP5Wrapper = dynamic(
  () => import('@p5-wrapper/next').then(mod => mod.NextReactP5Wrapper),
  { ssr: false }
);

export default function P5Canvas({ sketch, width = 600, height = 400, left = 0, top = 0, zIndex, isVisible = true}) {
  const style = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    zIndex: `${zIndex}`,
    display: isVisible ? 'block' : 'none', // Toggle display based on visibility prop
  };

  return (
    <div style={style}>
      <NextReactP5Wrapper sketch={(p5) => sketch(p5, width, height)} />
    </div>
  );
}

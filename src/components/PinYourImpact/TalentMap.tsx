import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export default function TalentMap({ companies, userProfile, onViewGlobe }: any = {}) {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().enableDamping = true;
      globeRef.current.controls().dampingFactor = 0.1;
    }
  }, []);

  return (
    <div className="w-full h-[600px] bg-[#0a1428] rounded-3xl overflow-hidden border border-gray-800">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        width={window.innerWidth > 1200 ? 1200 : window.innerWidth - 40}
        height={600}
        atmosphereColor="#16a34a"
        atmosphereAltitude={0.3}
        pointsData={[]}
        pointAltitude={0.01}
        pointColor={() => '#1e40af'}
        pointRadius={0.8}
        onGlobeReady={() => console.log('3D Globe is now working')}
      />
    </div>
  );
}

import { Environment, Lightformer } from "@react-three/drei";

const StudioLights = () => {
  return (
    <group name="lights">
      <Environment resolution={512}>
        {/* 1. FRONT PANEL (+Z) */}
        <Lightformer 
          form="rect" 
          intensity={5} 
          position={[0, 0, 8]} 
          scale={[10, 5]} 
          target={[0, 0, 0]} 
        />

        {/* 2. BACK PANEL (-Z) - This is what you need for the back! */}
        <Lightformer 
          form="rect" 
          intensity={0.8} 
          position={[0, 0, -8]} 
          scale={[10, 5]} 
          target={[0, 0, 0]} 
        />

        {/* 3. RIGHT SIDE (+X) */}
        <Lightformer 
          form="rect" 
          intensity={2} 
          position={[8, 0, 0]} 
          scale={[10, 5]} 
          rotation-y={-Math.PI / 2} 
        />

        {/* 4. LEFT SIDE (-X) */}
        <Lightformer 
          form="rect" 
          intensity={2} 
          position={[-8, 0, 0]} 
          scale={[10, 5]} 
          rotation-y={Math.PI / 2} 
        />

        {/* 5. TOP PANEL (+Y) */}
        <Lightformer 
          form="rect" 
          intensity={3} 
          position={[0, 8, 0]} 
          scale={[10, 10]} 
          rotation-x={Math.PI / 2} 
        />
      </Environment>
    </group>
  );
};

export default StudioLights;
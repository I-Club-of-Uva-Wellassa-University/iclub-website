import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Physics, useSphere } from '@react-three/cannon'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const COUNT = 26
const rfs = THREE.MathUtils.randFloatSpread

const PULL_X = 24
const PULL_Y = 48
const PULL_Z = 44

const globeGeometry = new THREE.SphereGeometry(1, 48, 48)
const globeMaterial = new THREE.MeshStandardMaterial({
  color: '#98D5EE',
  roughness: 0.5,
  metalness: 0.1,
})

function makeRingsGeometry() {
  const a = new THREE.TorusGeometry(1.35, 0.014, 8, 80)
  a.scale(1, 0.8, 1)
  a.rotateX(1.1)
  a.rotateZ(0.5)

  const b = new THREE.TorusGeometry(1.42, 0.014, 8, 80)
  b.scale(1, 0.75, 1)
  b.rotateX(0.6)
  b.rotateZ(-0.9)

  return mergeGeometries([a, b])
}
const ringsGeometry = makeRingsGeometry()
const ringsMaterial = new THREE.MeshBasicMaterial({ color: '#E1F2FA' })

function Clump() {
    const mat = useMemo(() => new THREE.Matrix4(), [])
    const vec = useMemo(() => new THREE.Vector3(), [])
    const ringsRef = useRef()
  
    const [ref, api] = useSphere(() => ({
      args: [1.25],
      mass: 1,
      angularDamping: 0.1,
      linearDamping: 0.65,
      position: [rfs(26), rfs(14), rfs(8)],
    }))
  
    useFrame(() => {
      if (!ref.current || !ringsRef.current) return
  
      for (let i = 0; i < COUNT; i++) {
        ref.current.getMatrixAt(i, mat)
  
        vec.setFromMatrixPosition(mat).normalize()
        api.at(i).applyForce(
          [-vec.x * PULL_X, -vec.y * PULL_Y, -vec.z * PULL_Z],
          [0, 0, 0]
        )
  
        ringsRef.current.setMatrixAt(i, mat)
      }
      ringsRef.current.instanceMatrix.needsUpdate = true
    })
  
    return (
      <>
        <instancedMesh ref={ref} args={[globeGeometry, globeMaterial, COUNT]} />
        <instancedMesh
          ref={ringsRef}
          args={[ringsGeometry, ringsMaterial, COUNT]}
          frustumCulled={false}
        />
      </>
    )
  }

function Pointer() {
  const viewport = useThree((s) => s.viewport)
  const [, api] = useSphere(() => ({
    type: 'Kinematic',
    args: [3],
    position: [0, 0, 0],
  }))

  useFrame((state) => {
    api.position.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0
    )
  })
  return null
}

export function BaublesBackground({ eventSource }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 22], fov: 35, near: 1, far: 50 }}
      eventSource={eventSource}
      eventPrefix="client"
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} />

      <Physics gravity={[0, 2, 0]} iterations={10}>
        <Pointer />
        <Clump />
      </Physics>

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[0, 5, -5]} scale={[20, 10, 1]} />
        <Lightformer form="rect" intensity={1} position={[-5, 0, 5]} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={1} position={[5, 0, 5]} scale={[10, 10, 1]} />
      </Environment>
    </Canvas>
  )
}
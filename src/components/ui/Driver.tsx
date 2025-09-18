import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'

const Driver = () => {
  const hologramCanvasRef = useRef(null)
  const backgroundCanvasRef = useRef(null)
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true)
  const autoPlayEnabledRef = useRef(true)
  const [timeProgress, setTimeProgress] = useState(0)
  const totalTime = 8000 // 8초마다 넘어감

  const autoPlayTimerRef = useRef(null)
  const progressTimerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const particleSystemRef = useRef(null)
  const targetPositionsRef = useRef([])
  const canvas2DRef = useRef(null)
  const ctxRef = useRef(null)
  const isTransitioningRef = useRef(false)

  // 배경 Matrix 효과 관련 변수들
  const backgroundSceneRef = useRef(null)
  const backgroundCameraRef = useRef(null)
  const backgroundRendererRef = useRef(null)
  const backgroundAnimationIdRef = useRef(null)
  const subtleParticlesRef = useRef([])
  const backgroundClockRef = useRef(null)

  // F1 드라이버 데이터 (2025 시즌 팀별/포인트 순서)
  const drivers = useMemo(() => [
    // McLaren (1위 팀)
    {
      id: 1,
      name: 'Lando Norris',
      lastName: 'Norris',
      team: 'McLaren',
      number: 4,
      image: '/assets/images/Drivers/McLaren_Lando_Norris_4.jpg',
      championships: 0,
      wins: 1
    },
    {
      id: 2,
      name: 'Oscar Piastri',
      lastName: 'Piastri',
      team: 'McLaren',
      number: 81,
      image: '/assets/images/Drivers/McLaren_Oscar_Piastri_81.jpg',
      championships: 0,
      wins: 2
    },
    // Ferrari (2위 팀)
    {
      id: 3,
      name: 'Lewis Hamilton',
      lastName: 'Hamilton',
      team: 'Ferrari',
      number: 44,
      image: '/assets/images/Drivers/Ferrari_Lewis_Hamilton_44.jpg',
      championships: 7,
      wins: 105
    },
    {
      id: 4,
      name: 'Charles Leclerc',
      lastName: 'Leclerc',
      team: 'Ferrari',
      number: 16,
      image: '/assets/images/Drivers/Ferrari_Charles_Leclerc_16.jpg',
      championships: 0,
      wins: 8
    },
    // Red Bull Racing (3위 팀)
    {
      id: 5,
      name: 'Max Verstappen',
      lastName: 'Verstappen',
      team: 'Red Bull Racing',
      number: 1,
      image: '/assets/images/Drivers/Red_Bull_Racing_Max_Verstappen_1.jpg',
      championships: 3,
      wins: 50
    },
    {
      id: 6,
      name: 'Yuki Tsunoda',
      lastName: 'Tsunoda',
      team: 'Red Bull Racing',
      number: 22,
      image: '/assets/images/Drivers/Red_Bull_Racing_Yuki_Tsunoda_22  .jpg',
      championships: 0,
      wins: 0
    },
    // Mercedes (4위 팀)
    {
      id: 7,
      name: 'George Russell',
      lastName: 'Russell',
      team: 'Mercedes',
      number: 63,
      image: '/assets/images/Drivers/Mercedes_George_Russell_63.jpg',
      championships: 0,
      wins: 2
    },
    {
      id: 8,
      name: 'Andrea Kimi Antonelli',
      lastName: 'Antonelli',
      team: 'Mercedes',
      number: 12,
      image: '/assets/images/Drivers/Mercedes_Andrea_Kimi_Antonelli_12.jpg',
      championships: 0,
      wins: 0
    },
    // Aston Martin (5위 팀)
    {
      id: 9,
      name: 'Fernando Alonso',
      lastName: 'Alonso',
      team: 'Aston Martin',
      number: 14,
      image: '/assets/images/Drivers/Aston_Martin_Fernando_Alonso_14.jpg',
      championships: 2,
      wins: 32
    },
    {
      id: 10,
      name: 'Lance Stroll',
      lastName: 'Stroll',
      team: 'Aston Martin',
      number: 18,
      image: '/assets/images/Drivers/Aston_Martin_Lance_Stroll_18.jpg',
      championships: 0,
      wins: 0
    },
    // 알핀 (6위 팀)
    {
      id: 11,
      name: 'Pierre Gasly',
      lastName: 'Gasly',
      team: '알핀',
      number: 10,
      image: '/assets/images/Drivers/Alpine_Pierre_Gasly_10.jpg',
      championships: 0,
      wins: 1
    },
    {
      id: 12,
      name: 'Jack Doohan',
      lastName: 'Doohan',
      team: '알핀',
      number: 7,
      image: '/assets/images/Drivers/Alpine_Jack_Doohan_7.jpg',
      championships: 0,
      wins: 0
    },
    // Haas (7위 팀)
    {
      id: 13,
      name: 'Esteban Ocon',
      lastName: 'Ocon',
      team: 'Haas',
      number: 31,
      image: '/assets/images/Drivers/Haas_Esteban_Ocon_31.jpg',
      championships: 0,
      wins: 1
    },
    {
      id: 14,
      name: 'Oliver Bearman',
      lastName: 'Bearman',
      team: 'Haas',
      number: 87,
      image: '/assets/images/Drivers/Haas_Oliver_Bearman_87.jpg',
      championships: 0,
      wins: 0
    },
    // Racing Bulls (8위 팀)
    {
      id: 15,
      name: 'Liam Lawson',
      lastName: 'Lawson',
      team: 'Racing Bulls',
      number: 30,
      image: '/assets/images/Drivers/Racing_Bulls_Liam_Lawson_30.jpg',
      championships: 0,
      wins: 0
    },
    {
      id: 16,
      name: 'Isack Hadjar',
      lastName: 'Hadjar',
      team: 'Racing Bulls',
      number: 6,
      image: '/assets/images/Drivers/Racing_Bulls_Isack_Hadjar_6.jpg',
      championships: 0,
      wins: 0
    },
    // Williams (9위 팀)
    {
      id: 17,
      name: 'Carlos Sainz',
      lastName: 'Sainz',
      team: 'Williams',
      number: 55,
      image: '/assets/images/Drivers/Williams_Carlos_Sainz_55.jpg',
      championships: 0,
      wins: 4
    },
    {
      id: 18,
      name: 'Alexander Albon',
      lastName: 'Albon',
      team: 'Williams',
      number: 23,
      image: '/assets/images/Drivers/Williams_Alexander_Albon_23.jpg',
      championships: 0,
      wins: 0
    },
    // Sauber (10위 팀)
    {
      id: 19,
      name: 'Gabriel Bortoleto',
      lastName: 'Bortoleto',
      team: 'Sauber',
      number: 5,
      image: '/assets/images/Drivers/Sauber_Gabriel_Bortoleto_5.jpg',
      championships: 0,
      wins: 0
    },
    {
      id: 20,
      name: 'Nico Huelkenberg',
      lastName: 'Huelkenberg',
      team: 'Sauber',
      number: 27,
      image: '/assets/images/Drivers/Sauber_Nico_Huelkenberg_27.jpg',
      championships: 0,
      wins: 0
    }
  ], [])

  const selectedDriver = useMemo(() => drivers[currentDriverIndex] || drivers[0], [drivers, currentDriverIndex])

  // 팀별 그룹핑 (2025 포인트 순서)
  const teamGroups = useMemo(() => {
    const teams = [
      { name: 'McLaren', startIndex: 0, count: 2 },
      { name: 'Ferrari', startIndex: 2, count: 2 },
      { name: 'Red Bull Racing', startIndex: 4, count: 2 },
      { name: 'Mercedes', startIndex: 6, count: 2 },
      { name: 'Aston Martin', startIndex: 8, count: 2 },
      { name: '알핀', startIndex: 10, count: 2 },
      { name: 'Haas', startIndex: 12, count: 2 },
      { name: 'Racing Bulls', startIndex: 14, count: 2 },
      { name: 'Williams', startIndex: 16, count: 2 },
      { name: 'Sauber', startIndex: 18, count: 2 }
    ]

    return teams.map(team => ({
      name: team.name,
      drivers: drivers
        .slice(team.startIndex, team.startIndex + team.count)
        .map((driver, idx) => ({
          ...driver,
          index: team.startIndex + idx
        }))
    }))
  }, [drivers])

  const initThreeJS = useCallback(() => {
    const canvas = hologramCanvasRef.current
    if (!canvas) return

    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    rendererRef.current = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    })

    rendererRef.current.setSize(800, 800)
    rendererRef.current.setClearColor(0x000000, 0)

    cameraRef.current.position.set(0, -50, 600)
    cameraRef.current.lookAt(0, -50, 0)

    animate()
  }, [])

  const createParticleSystem = useCallback(() => {
    const particleCount = 75000
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const alpha = new Float32Array(particleCount)

    // 초기에는 모든 파티클을 숨김 (이미지 로드 후에만 표시)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0

      colors[i * 3] = 0      // R
      colors[i * 3 + 1] = 0  // G
      colors[i * 3 + 2] = 0  // B

      sizes[i] = 1.0
      alpha[i] = 0.0
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1))

    // 고품질 홀로그램 쉐이더
    const hologramVertexShader = `
      uniform float time;
      uniform float glitchIntensity;
      attribute float size;
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;
        vAlpha = alpha;

        vec3 pos = position;

        // 홀로그램 불안정 효과
        float glitch = sin(time * 10.0 + pos.x * 0.1 + pos.y * 0.1) * glitchIntensity;
        pos.x += glitch * 2.0;
        pos.z += sin(time * 8.0 + pos.y * 0.05) * glitchIntensity * 1.5;

        // 스캔라인 효과를 위한 위치 변화
        float scanline = sin(pos.y * 0.1 + time * 5.0) * 0.5;
        pos.x += scanline * 0.3;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const hologramFragmentShader = `
      uniform float time;
      uniform float glitchIntensity;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // 원형 파티클 모양
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);

        if (dist > 0.5) discard;

        // 홀로그램 글리치 효과
        float glitch = step(0.95, sin(time * 20.0 + gl_FragCoord.x * 0.1)) * glitchIntensity;

        // 스캔라인 효과
        float scanlines = sin(gl_FragCoord.y * 0.5 + time * 10.0) * 0.1 + 0.9;

        // 홀로그램 색상 강화
        vec3 hologramColor = vColor;
        hologramColor += vec3(0.3, 0.6, 1.0) * 0.4;
        hologramColor *= scanlines;

        // 중심부는 더 밝게
        float centerGlow = 1.0 - dist * 2.0;
        hologramColor *= (0.7 + centerGlow * 0.5);

        // 글리치 시 색상 변화
        if (glitch > 0.5) {
          hologramColor.r += 0.3;
          hologramColor.g *= 0.7;
        }

        float finalAlpha = vAlpha * (1.0 - dist) * scanlines;
        gl_FragColor = vec4(hologramColor, finalAlpha);
      }
    `

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        glitchIntensity: { value: 0.1 }
      },
      vertexShader: hologramVertexShader,
      fragmentShader: hologramFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })

    particleSystemRef.current = new THREE.Points(geometry, material)
    particleSystemRef.current.position.set(0, -50, 0)
    sceneRef.current.add(particleSystemRef.current)

    // 홀로그램 글로우 효과 추가
    addHologramGlow()
  }, [])

  const addHologramGlow = useCallback(() => {
    // 홀로그램 베이스 글로우
    const glowGeometry = new THREE.PlaneGeometry(400, 400)
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        opacity: { value: 0.3 },
        color: { value: new THREE.Color(0x00d4ff) }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vPosition = position;

          vec3 pos = position;
          pos.z += sin(time * 2.0 + pos.x * 0.01) * 5.0;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        uniform vec3 color;
        varying vec2 vUv;

        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);

          float pulse = sin(time * 3.0) * 0.5 + 0.5;
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow *= (0.5 + pulse * 0.5);

          // 스캔라인 효과
          float scanlines = sin(vUv.y * 50.0 + time * 5.0) * 0.1 + 0.9;
          glow *= scanlines;

          gl_FragColor = vec4(color, glow * opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    glowMesh.position.set(0, -50, -50)
    sceneRef.current.add(glowMesh)

    // 홀로그램 링 효과들
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(100 + i * 50, 110 + i * 50, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5, 0.8, 0.5),
        transparent: true,
        opacity: 0.2 - i * 0.05,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })

      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.set(0, -50, -20 - i * 10)
      ring.rotation.x = Math.PI / 2
      ring.userData = {
        baseOpacity: 0.2 - i * 0.05,
        rotationSpeed: 0.01 + i * 0.005,
        pulseSpeed: 1 + i * 0.3
      }
      sceneRef.current.add(ring)
    }
  }, [])

  const loadDriverImage = useCallback((driverIndex) => {
    const driver = drivers[driverIndex]
    if (!driver) return

    console.log('Loading driver image:', driver.image)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      console.log('Image loaded successfully:', img.width, img.height)
      imageToParticles(img)
    }
    img.onerror = () => {
      console.error('Failed to load image:', driver.image)
    }
    img.src = driver.image
  }, [drivers])

  const imageToParticles = useCallback((image) => {
    // 이미지를 캔버스에 그리기 (원본 해상도 최대 활용)
    const width = 600
    const height = 600
    canvas2DRef.current.width = width
    canvas2DRef.current.height = height

    ctxRef.current.clearRect(0, 0, width, height)
    ctxRef.current.imageSmoothingEnabled = false
    ctxRef.current.drawImage(image, 0, 0, width, height)

    const imageData = ctxRef.current.getImageData(0, 0, width, height)
    const pixels = imageData.data

    const newTargetPositions = []

    // 픽셀을 3D 좌표로 변환
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const index = (Math.floor(y) * width + Math.floor(x)) * 4
        const alpha = pixels[index + 3]
        const r = pixels[index]
        const g = pixels[index + 1]
        const b = pixels[index + 2]

        // 인물만 표시 (배경 완전 제거)
        const isNotBackground = alpha > 100 && (r + g + b > 150) &&
          !(r > 200 && g > 200 && b > 200)

        if (isNotBackground) {
          const brightness = (r + g + b) / 3

          // 도트 느낌: 밝은 부분은 적게, 어두운 부분은 많게
          let dotIntensity = 1
          if (brightness < 80) {
            dotIntensity = 3
          } else if (brightness < 150) {
            dotIntensity = 2
          } else {
            dotIntensity = 1
          }

          // 엣지 디텍션 추가
          const isEdge = Math.floor(x) > 0 && Math.floor(y) > 0 &&
            Math.floor(x) < width - 1 && Math.floor(y) < height - 1
          if (isEdge) {
            const leftIdx = (Math.floor(y) * width + Math.floor(x) - 1) * 4
            const rightIdx = (Math.floor(y) * width + Math.floor(x) + 1) * 4
            const upIdx = ((Math.floor(y) - 1) * width + Math.floor(x)) * 4
            const downIdx = ((Math.floor(y) + 1) * width + Math.floor(x)) * 4

            const diffLeft = Math.abs(pixels[leftIdx] - r)
            const diffRight = Math.abs(pixels[rightIdx] - r)
            const diffUp = Math.abs(pixels[upIdx] - r)
            const diffDown = Math.abs(pixels[downIdx] - r)

            const edgeStrength = (diffLeft + diffRight + diffUp + diffDown) / 4
            if (edgeStrength > 40) {
              dotIntensity += 2
            }
          }

          const posX = (x - width / 2) * 0.8
          const posY = -(y - height / 2) * 0.8 - 50

          // 입체감을 위한 Z축 깊이 계산
          let depthZ = 0

          if (brightness > 180) {
            depthZ = 15 + Math.random() * 10
          } else if (brightness > 120) {
            depthZ = 5 + Math.random() * 5
          } else {
            depthZ = -5 + Math.random() * 5
          }

          const centerX = width / 2
          const centerY = height / 2
          const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
          const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const centerBoost = (1 - distanceFromCenter / maxDistance) * 10

          const posZ = depthZ + centerBoost

          // 실제 이미지 색상을 홀로그램 색상으로 변환
          const hologramR = (r / 255) * 0.3 + 0.2
          const hologramG = (g / 255) * 0.8 + 0.4
          const hologramB = (b / 255) * 0.6 + 0.8

          // 깊이에 따른 색상 변화
          const depthFactor = (posZ + 15) / 30
          const finalR = hologramR * (0.5 + depthFactor * 0.5)
          const finalG = hologramG * (0.5 + depthFactor * 0.5)
          const finalB = hologramB * (0.7 + depthFactor * 0.3)

          // 명암과 엣지에 따른 파티클 생성
          for (let d = 0; d < dotIntensity; d++) {
            newTargetPositions.push(
              posX + (Math.random() - 0.5) * 0.3,
              posY + (Math.random() - 0.5) * 0.3,
              posZ + (Math.random() - 0.5) * 2,
              finalR, finalG, finalB
            )
          }
        }
      }
    }

    console.log('Generated particles:', newTargetPositions.length / 6)
    targetPositionsRef.current = newTargetPositions
    morphParticles()
  }, [])

  const morphParticles = useCallback(() => {
    if (!particleSystemRef.current || targetPositionsRef.current.length === 0) return

    const positions = particleSystemRef.current.geometry.attributes.position.array
    const colors = particleSystemRef.current.geometry.attributes.color.array
    const sizes = particleSystemRef.current.geometry.attributes.size.array
    const alpha = particleSystemRef.current.geometry.attributes.alpha.array
    const targetCount = Math.floor(targetPositionsRef.current.length / 6)

    // 사용될 파티클들을 타겟 위치로 이동
    for (let i = 0; i < targetCount && i < positions.length / 3; i++) {
      const particleIndex = i * 3
      const targetIndex = i * 6

      if (targetIndex + 5 < targetPositionsRef.current.length) {
        const speed = 0.12
        positions[particleIndex] += (targetPositionsRef.current[targetIndex] - positions[particleIndex]) * speed
        positions[particleIndex + 1] += (targetPositionsRef.current[targetIndex + 1] - positions[particleIndex + 1]) * speed
        positions[particleIndex + 2] += (targetPositionsRef.current[targetIndex + 2] - positions[particleIndex + 2]) * speed

        colors[particleIndex] = targetPositionsRef.current[targetIndex + 3]
        colors[particleIndex + 1] = targetPositionsRef.current[targetIndex + 4]
        colors[particleIndex + 2] = targetPositionsRef.current[targetIndex + 5]

        const depth = targetPositionsRef.current[targetIndex + 2]
        const brightness = (colors[particleIndex] + colors[particleIndex + 1] + colors[particleIndex + 2]) / 3
        sizes[i] = 0.8 + brightness * 1.5 + Math.max(0, depth * 0.05)

        alpha[i] = Math.min(1.0, 0.6 + brightness * 0.4)
      }
    }

    // 사용되지 않는 파티클들은 숨김
    for (let i = targetCount; i < positions.length / 3; i++) {
      const particleIndex = i * 3
      positions[particleIndex] = 0
      positions[particleIndex + 1] = 0
      positions[particleIndex + 2] = 0
      colors[particleIndex] = 0
      colors[particleIndex + 1] = 0
      colors[particleIndex + 2] = 0
      sizes[i] = 0
      alpha[i] = 0
    }

    particleSystemRef.current.geometry.attributes.position.needsUpdate = true
    particleSystemRef.current.geometry.attributes.color.needsUpdate = true
    particleSystemRef.current.geometry.attributes.size.needsUpdate = true
    particleSystemRef.current.geometry.attributes.alpha.needsUpdate = true
  }, [])

  const morphToDriver = useCallback((newIndex) => {
    if (isTransitioningRef.current) return

    isTransitioningRef.current = true

    // 파티클 분산
    const positions = particleSystemRef.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += (Math.random() - 0.5) * 200
      positions[i + 1] += (Math.random() - 0.5) * 200
      positions[i + 2] += (Math.random() - 0.5) * 100
    }

    // 즉시 드라이버 정보 업데이트
    setCurrentDriverIndex(newIndex)

    setTimeout(() => {
      loadDriverImage(newIndex)
      isTransitioningRef.current = false
    }, 500)
  }, [loadDriverImage])

  const animate = useCallback(() => {
    const animateLoop = () => {
      animationIdRef.current = requestAnimationFrame(animateLoop)
      const time = Date.now() * 0.001

      if (particleSystemRef.current) {
        // 파티클 모핑
        morphParticles()

        // 쉐이더 유니폼 업데이트
        if (particleSystemRef.current.material.uniforms) {
          particleSystemRef.current.material.uniforms.time.value = time
          const glitchPhase = Math.sin(time * 0.5) * 0.5 + 0.5
          particleSystemRef.current.material.uniforms.glitchIntensity.value = 0.05 + glitchPhase * 0.15
        }

        // 둥둥 떠다니는 홀로그램 효과
        particleSystemRef.current.position.y = -50 + Math.sin(time * 0.8) * 3
        particleSystemRef.current.position.x = Math.sin(time * 0.4) * 1.5
        particleSystemRef.current.position.z = Math.sin(time * 0.6) * 2

        // 미세한 흔들림
        particleSystemRef.current.rotation.x = Math.sin(time * 3) * 0.008
        particleSystemRef.current.rotation.z = Math.cos(time * 2.5) * 0.006
      }

      // 글로우 효과 애니메이션
      sceneRef.current.children.forEach((child) => {
        if (child.material && child.material.uniforms && child.material.uniforms.time) {
          child.material.uniforms.time.value = time
        }

        // 링 효과 애니메이션
        if (child.userData && child.userData.rotationSpeed) {
          child.rotation.z += child.userData.rotationSpeed

          const pulse = Math.sin(time * child.userData.pulseSpeed) * 0.5 + 0.5
          child.material.opacity = child.userData.baseOpacity + pulse * 0.1
          child.scale.setScalar(1 + pulse * 0.05)
        }
      })

      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }

    animateLoop()
  }, [morphParticles])

  // 드라이버 선택
  const selectDriver = useCallback((index) => {
    if (index !== currentDriverIndex && !isTransitioningRef.current) {
      resetAutoPlayTimer()
      morphToDriver(index)
    }
  }, [currentDriverIndex, morphToDriver])

  const previousDriver = useCallback(() => {
    const prevIndex = (currentDriverIndex - 1 + drivers.length) % drivers.length
    selectDriver(prevIndex)
  }, [currentDriverIndex, drivers.length, selectDriver])

  const nextDriver = useCallback(() => {
    const nextIndex = (currentDriverIndex + 1) % drivers.length
    selectDriver(nextIndex)
  }, [currentDriverIndex, drivers.length, selectDriver])

  // 자동 재생 관련 함수들
  const startAutoPlay = useCallback(() => {
    if (!autoPlayEnabledRef.current) return

    setTimeProgress(0)

    autoPlayTimerRef.current = setInterval(() => {
      if (!isTransitioningRef.current) {
        nextDriver()
      }
    }, totalTime)

    progressTimerRef.current = setInterval(() => {
      if (autoPlayTimerRef.current && autoPlayEnabledRef.current) {
        setTimeProgress(prev => {
          const newProgress = prev + 50
          return newProgress >= totalTime ? 0 : newProgress
        })
      } else {
        clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }, 50)
  }, [])

  const resetAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    autoPlayEnabledRef.current = autoPlayEnabled
    setTimeProgress(0)
    if (autoPlayEnabled) {
      setTimeout(() => {
        if (autoPlayEnabledRef.current) {
          startAutoPlay()
        }
      }, 100)
    }
  }, [autoPlayEnabled])

  useEffect(() => {
    if (hologramCanvasRef.current) {
      // 2D Canvas 초기화
      canvas2DRef.current = document.createElement('canvas')
      ctxRef.current = canvas2DRef.current.getContext('2d')

      initThreeJS()
      createParticleSystem()
      loadDriverImage(0)

      // 자동재생 시작
      setTimeout(startAutoPlay, 2000)
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="lusion-hologram-system">
      {/* Point Cloud 홀로그램 */}
      <div className="hologram-main">
        <canvas ref={hologramCanvasRef} className="hologram-canvas"></canvas>

        {/* 우측 하단 상세정보 */}
        <div className="driver-details">
          <h1 className="section-title">DRIVERS</h1>
          <div className="driver-info">
            <h2 className="driver-name">{selectedDriver.name}</h2>
            <p className="driver-team">{selectedDriver.team}</p>
            <div className="driver-stats">
              <div className="stat">
                <span className="stat-label">Championships</span>
                <span className="stat-value">{selectedDriver.championships || 0}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Wins</span>
                <span className="stat-value">{selectedDriver.wins || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 좌측 하단 진행률 */}
        <div className="progress-section">
          <div className="progress-dots">
            {drivers.map((driver, index) => (
              <div
                key={driver.id}
                className={`progress-dot ${index === currentDriverIndex ? 'active' : ''}`}
                onClick={() => selectDriver(index)}
              ></div>
            ))}
          </div>
          <div className="controls">
            <button onClick={previousDriver} className="nav-btn">‹</button>
            <button onClick={nextDriver} className="nav-btn">›</button>

            <div className="timer-container">
              <div className="timer-track">
                <div
                  className="timer-progress"
                  style={{
                    transform: `scaleX(${timeProgress / totalTime})`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 팀별 드라이버 선택 카드들 */}
      <div className="driver-selection">
        <div className="team-groups">
          {teamGroups.map((teamGroup, teamIndex) => (
            <div key={teamGroup.name} className="team-group">
              <div className="team-label">{teamGroup.name}</div>
              <div className="team-drivers">
                {teamGroup.drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className={`driver-card-mini ${driver.index === currentDriverIndex ? 'active' : ''}`}
                    onClick={() => selectDriver(driver.index)}
                  >
                    <img src={driver.image} alt={driver.name} className="card-avatar" />
                    <div className="card-info">
                      <span className="card-number">{driver.number}</span>
                      <span className="card-name">{driver.lastName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .lusion-hologram-system {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          position: relative;
          color: white;
        }

        .hologram-main {
          position: relative;
          width: 100%;
          height: 120vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 10;
        }

        .hologram-canvas {
          width: min(800px, 50vw);
          height: min(800px, 50vw);
          position: absolute;
          left: 50%;
          top: 5%;
          transform: translateX(-50%);
          z-index: 9999;
          opacity: 1;
          pointer-events: none;
        }

        /* 우측 하단 상세정보 */
        .driver-details {
          position: absolute;
          bottom: 35%;
          right: 15%;
          max-width: 400px;
          z-index: 20;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          margin: 0 0 2rem 0;
          color: white;
        }

        .driver-name {
          font-size: 2rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: white;
          animation: sparkle 2s ease-in-out infinite alternate;
        }

        @keyframes sparkle {
          0% {
            text-shadow:
              0 0 30px rgba(255, 255, 255, 0.3),
              0 0 60px rgba(0, 212, 255, 0.4);
          }
          100% {
            text-shadow:
              0 0 50px rgba(255, 255, 255, 0.6),
              0 0 80px rgba(0, 212, 255, 0.8),
              0 0 100px rgba(255, 255, 255, 0.4);
          }
        }

        .driver-team {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 2rem 0;
        }

        .driver-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #00d4ff;
        }

        /* 좌측 하단 진행률 */
        .progress-section {
          position: absolute;
          bottom: 35%;
          left: 8%;
          z-index: 20;
        }

        .progress-dots {
          display: flex;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: #00d4ff;
          box-shadow: 0 0 10px #00d4ff;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: #00d4ff;
        }

        .timer-container {
          display: flex;
          align-items: center;
          margin-left: 8px;
        }

        .timer-track {
          width: 40px;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1.5px;
          overflow: hidden;
          position: relative;
        }

        .timer-progress {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #0099cc);
          border-radius: 1.5px;
          transform-origin: left;
          transition: transform 0.05s linear;
          box-shadow: 0 0 6px rgba(0, 212, 255, 0.3);
        }

        /* 하단 팀별 드라이버 선택 카드들 */
        .driver-selection {
          position: absolute;
          top: 75%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          width: 90%;
          max-width: 1200px;
        }

        .team-groups {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .team-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .team-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          text-align: center;
          margin-bottom: 4px;
          min-height: 16px;
        }

        .team-drivers {
          display: flex;
          gap: 6px;
          justify-content: center;
        }

        .driver-card-mini {
          flex-shrink: 0;
          width: 80px;
          height: 100px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 6px;
        }

        .driver-card-mini.active {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }

        .driver-card-mini:hover {
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .card-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 6px;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .card-number {
          font-size: 0.8rem;
          color: #00d4ff;
          font-weight: 600;
        }

        .card-name {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default Driver
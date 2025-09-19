import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const Teams = () => {
  const canvasRef = useRef(null)
  const teamsCanvasRef = useRef(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [hoveredTeam, setHoveredTeam] = useState(null)
  const [carEntering, setCarEntering] = useState(false)
  const [carCentered, setCarCentered] = useState(false)
  const [panelsAssembling, setPanelsAssembling] = useState(false)

  // Teams 3D 관련 변수들
  const teamsSceneRef = useRef(null)
  const teamsCameraRef = useRef(null)
  const teamsRendererRef = useRef(null)
  const teamsAnimationIdRef = useRef(null)
  const teamSpheresRef = useRef([])
  const raycasterRef = useRef(null)
  const mouseRef = useRef(null)

  // Main 3D scene variables
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const composerRef = useRef(null)
  const bloomPassRef = useRef(null)
  const controlsRef = useRef(null)
  const carRef = useRef(null)
  const carTextureRef = useRef(null)
  const animationIdRef = useRef(null)

  const teams = useMemo(() => [
    {
      id: 1,
      name: 'Red Bull Racing',
      country: 'Austria',
      championships: 6,
      wins: 118,
      carImage: 'Red_Bull_Racing_RB21.jpg',
      logo: 'Red_Bull_Racing.svg',
      color: 0x1E3A8A,
      slogan: 'Gives You Wings',
      engine: 'Honda RBPT',
      avgSpeed: '325 km/h',
      fuelEfficiency: '105 kg/race',
      technology: '어드밴스드 에어로다이나믹스',
      keyFeature: '터보차지 파워유닛',
      founded: '2005년',
      teamPrincipal: '크리스티안 호르너'
    },
    {
      id: 2,
      name: 'Ferrari',
      country: 'Italy',
      championships: 16,
      wins: 243,
      carImage: 'Ferrari_SF-25.jpg',
      logo: 'Ferrari.svg',
      color: 0xDC143C,
      slogan: 'The Prancing Horse',
      engine: 'Ferrari 066/12',
      avgSpeed: '320 km/h',
      fuelEfficiency: '110 kg/race',
      technology: '이탈리아 정통 엔지니어링',
      keyFeature: '혁신적 하이브리드 시스템',
      founded: '1950년',
      teamPrincipal: '프레드 박세'
    },
    {
      id: 3,
      name: 'Mercedes-AMG',
      country: 'Germany',
      championships: 8,
      wins: 125,
      carImage: 'Mercedes-AMG_F1_W16_E_Performance.jpg',
      logo: 'Mercedes.svg',
      color: 0x00D2BE,
      slogan: 'The Best or Nothing',
      engine: 'Mercedes-AMG M15',
      avgSpeed: '315 km/h',
      fuelEfficiency: '108 kg/race',
      technology: '독일 정밀 엔지니어링',
      keyFeature: 'EQS 전기 기술 적용',
      founded: '2010년',
      teamPrincipal: '토토 볼프'
    },
    {
      id: 4,
      name: 'McLaren',
      country: 'United Kingdom',
      championships: 8,
      wins: 183,
      carImage: 'McLaren_MCL39.png',
      logo: 'McLaren.svg',
      color: 0xFF8700,
      slogan: 'For The Fearless',
      engine: 'Mercedes-AMG M15',
      avgSpeed: '318 km/h',
      fuelEfficiency: '107 kg/race',
      technology: '카본파이버 모노코크',
      keyFeature: '어댑티브 서스펜션',
      founded: '1966년',
      teamPrincipal: '안드리아 스텔라'
    },
    {
      id: 5,
      name: 'Aston Martin',
      country: 'United Kingdom',
      championships: 0,
      wins: 1,
      carImage: 'Aston_Martin_AMR25.jpg',
      logo: 'Aston_Martin.svg',
      color: 0x006F62,
      slogan: 'Intensity Driven',
      engine: 'Mercedes-AMG M15',
      avgSpeed: '312 km/h',
      fuelEfficiency: '109 kg/race',
      technology: '럭셔리 퍼포먼스 융합',
      keyFeature: '어쿠스틱 엔지니어링',
      founded: '2021년',
      teamPrincipal: '마이크 크랙'
    },
    {
      id: 6,
      name: 'Alpine',
      country: 'France',
      championships: 2,
      wins: 21,
      carImage: 'Alpine_A525.jpg',
      logo: 'Alpine.webp',
      color: 0x0090FF,
      slogan: 'Unlock Your Potential',
      engine: 'Alpine E-Tech RE25',
      avgSpeed: '310 km/h',
      fuelEfficiency: '111 kg/race',
      technology: '프랑스 르노 기술',
      keyFeature: 'E-Tech 하이브리드',
      founded: '1981년',
      teamPrincipal: '올리버 오크스'
    },
    {
      id: 7,
      name: 'Williams',
      country: 'United Kingdom',
      championships: 9,
      wins: 114,
      carImage: 'Williams_FW47.jpg',
      logo: 'Williams.svg',
      color: 0x005AFF,
      slogan: 'Driven by Excellence',
      engine: 'Mercedes-AMG M15',
      avgSpeed: '308 km/h',
      fuelEfficiency: '112 kg/race',
      technology: '경량화 전문 기술',
      keyFeature: '에어로 효율성 극대화',
      founded: '1977년',
      teamPrincipal: '제임스 바울즈'
    },
    {
      id: 8,
      name: 'Racing Bulls',
      country: 'Italy',
      championships: 0,
      wins: 2,
      carImage: 'Racing_Bulls_RB_VCARB_02.jpg',
      logo: 'Racing_Bulls.webp',
      color: 0x6692FF,
      slogan: 'Young Energy Unleashed',
      engine: 'Honda RBPT',
      avgSpeed: '305 km/h',
      fuelEfficiency: '113 kg/race',
      technology: '젊은 드라이버 육성',
      keyFeature: '에너지 드링크 파워',
      founded: '2020년',
      teamPrincipal: '로랑 메키즈'
    },
    {
      id: 9,
      name: 'Haas',
      country: 'United States',
      championships: 0,
      wins: 0,
      carImage: 'Haas_VF-25.jpg',
      logo: 'Haas.svg',
      color: 0xFFFFFF,
      slogan: 'American Spirit',
      engine: 'Ferrari 066/12',
      avgSpeed: '302 km/h',
      fuelEfficiency: '114 kg/race',
      technology: '아메리칸 이노베이션',
      keyFeature: '스틸 머시닝 정밀도',
      founded: '2016년',
      teamPrincipal: '아야오 코마츠자키'
    },
    {
      id: 10,
      name: 'Sauber',
      country: 'Switzerland',
      championships: 0,
      wins: 1,
      carImage: 'Sauber_C45.jpg',
      logo: 'Sauber.svg',
      color: 0x52E252,
      slogan: 'Swiss Precision',
      engine: 'Ferrari 066/12',
      avgSpeed: '300 km/h',
      fuelEfficiency: '115 kg/race',
      technology: '스위스 정밀 기계공학',
      keyFeature: '친환경 지속가능성',
      founded: '1993년',
      teamPrincipal: '알레산드로 알룬니-브라비'
    }
  ], [])

  const getCarImage = useCallback((filename) => {
    return `/assets/images/Cars/${filename}`
  }, [])

  const getTeamLogo = useCallback((filename) => {
    return `/assets/images/Teams/${filename}`
  }, [])

  const getTeamColors = useCallback((teamId) => {
    const colorMap = {
      1: { primary: 'rgba(100, 140, 255, 0.7)', secondary: '#000000', accent: 'rgba(30, 58, 138, 0.6)' },
      2: { primary: 'rgba(255, 100, 120, 0.7)', secondary: '#000000', accent: 'rgba(220, 20, 60, 0.6)' },
      3: { primary: 'rgba(100, 255, 230, 0.7)', secondary: '#000000', accent: 'rgba(0, 210, 190, 0.6)' },
      4: { primary: 'rgba(255, 180, 80, 0.7)', secondary: '#000000', accent: 'rgba(255, 135, 0, 0.6)' },
      5: { primary: 'rgba(100, 200, 180, 0.7)', secondary: '#000000', accent: 'rgba(0, 111, 98, 0.6)' },
      6: { primary: 'rgba(120, 180, 255, 0.7)', secondary: '#000000', accent: 'rgba(255, 105, 180, 0.6)' },
      7: { primary: 'rgba(100, 150, 255, 0.7)', secondary: '#000000', accent: 'rgba(0, 90, 255, 0.6)' },
      8: { primary: 'rgba(150, 190, 255, 0.7)', secondary: '#1E3A8A', accent: 'rgba(102, 146, 255, 0.6)' },
      9: { primary: 'rgba(255, 255, 255, 0.9)', secondary: '#000000', accent: 'rgba(255, 255, 255, 0.6)' },
      10: { primary: 'rgba(150, 255, 150, 0.7)', secondary: '#000000', accent: 'rgba(82, 226, 82, 0.6)' }
    }
    return colorMap[teamId] || { primary: 'rgba(255, 255, 255, 0.7)', secondary: '#000000', accent: 'rgba(0, 144, 255, 0.6)' }
  }, [])

  // [Three.js 초기화] 3D 자동차 모델 표시를 위한 Three.js 설정
  const initThreeJS = useCallback(async () => {
    if (!canvasRef.current) return

    // [3D 장면 생성] 어두운 배경의 3D 공간
    sceneRef.current = new THREE.Scene()
    sceneRef.current.background = new THREE.Color(0x111111)  // 진회색 배경

    // [3D 카메라] 자동차를 볼 시점 설정
    cameraRef.current = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    cameraRef.current.position.set(0, 0, 8)  // 상대적으로 가까운 시점

    // [WebGL 렌더러] 고품질 3D 렌더링 설정
    rendererRef.current = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
    rendererRef.current.setPixelRatio(window.devicePixelRatio)  // 고해상도 디스플레이 대응
    rendererRef.current.shadowMap.enabled = true                // 그림자 효과 활성화
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap // 부드러운 그림자
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping // 영화적 색조 보정
    rendererRef.current.toneMappingExposure = 1.25               // 노출 조절 (25% 밝게)

    // [후처리 효과] 영화적 비주얼 효과를 위한 설정
    composerRef.current = new EffectComposer(rendererRef.current)
    const renderPass = new RenderPass(sceneRef.current, cameraRef.current)
    composerRef.current.addPass(renderPass)

    // [블룸 효과] 밝은 부분이 빛나는 효과 (자동차 하이라이트 등)
    bloomPassRef.current = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // 블룸 강도
      0.4, // 블룸 반경
      0.85 // 블룸 임계값 (얼마나 밝아야 빛날지)
    )
    composerRef.current.addPass(bloomPassRef.current)

    // [궤도 컨트롤] 마우스로 3D 자동차를 회전시켜 볼 수 있는 기능
    controlsRef.current = new OrbitControls(cameraRef.current, canvasRef.current)
    controlsRef.current.enableDamping = true         // 부드러운 움직임 (관성)
    controlsRef.current.dampingFactor = 0.05         // 관성 강도 (5%)
    controlsRef.current.minDistance = 5              // 최대 확대 거리
    controlsRef.current.maxDistance = 12             // 최대 축소 거리
    controlsRef.current.enablePan = false            // 팬 이동 비활성화 (회전만 가능)
    controlsRef.current.maxPolarAngle = Math.PI / 1.8 // 상단 회전 제한
    controlsRef.current.minPolarAngle = Math.PI / 3   // 하단 회전 제한

    // [조명 설정] 사실적이고 드라마틱한 3D 자동차 조명
    // 메인 조명 (태양광 역할)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3)  // 흰색 강한 빛
    directionalLight.position.set(5, 5, 5)  // 우측 상단에서 비춰준
    directionalLight.castShadow = true      // 그림자 생성
    sceneRef.current.add(directionalLight)

    // 전체 환경광 (대기 빛 역할)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8)  // 어두운 회색 전체 빛
    sceneRef.current.add(ambientLight)

    // 림 라이트 (팀 색상의 외곽선 강조 조명)
    const rimLight = new THREE.DirectionalLight(selectedTeam?.color || 0x0090FF, 2)
    rimLight.position.set(-5, 0, 2)  // 왼쪽에서 외곽선 빛
    sceneRef.current.add(rimLight)

    // [3D 자동차 생성] 팀별 자동차 이미지를 로드하여 3D 모델 생성
    await loadCarTexture()        // 선택된 팀의 자동차 이미지 로드
    createEnhanced3DCarModel()    // 3D 자동차 모델 생성 (여러 면으로 구성)

    animate()
  }, [selectedTeam])

  // [텍스처 로드] 선택된 팀의 자동차 이미지를 3D 텍스처로 로드
  const loadCarTexture = useCallback(async () => {
    if (!selectedTeam) return

    // [Three.js 텍스처 로더] 이미지 파일을 3D 텍스처로 변환
    const loader = new THREE.TextureLoader()
    try {
      const imagePath = getCarImage(selectedTeam.carImage)  // 팀별 자동차 이미지 경로
      carTextureRef.current = await new Promise((resolve, reject) => {
        loader.load(imagePath, resolve, undefined, reject)  // 비동기 로드
      })
      // [텍스처 설정] 이미지가 에지에서 반복되지 않도록 설정
      carTextureRef.current.wrapS = THREE.ClampToEdgeWrapping  // S축 (가로) 클램핑
      carTextureRef.current.wrapT = THREE.ClampToEdgeWrapping  // T축 (세로) 클램핑
      carTextureRef.current.flipY = false                     // Y축 뒤집기 비활성화
    } catch (error) {
      console.warn('Failed to load car texture:', error)
      carTextureRef.current = null
    }
  }, [selectedTeam, getCarImage])

  // [3D 자동차 모델] 여러 면을 조합해서 입체적인 3D 자동차 모델 생성
  const createEnhanced3DCarModel = useCallback(() => {
    const group = new THREE.Group()  // 여러 면을 그룹화할 컨테이너

    // [메인 자동차 모델] 여러 면을 조합해서 입체감 생성
    if (carTextureRef.current) {
      // [전면] 주 자동차 이미지가 나타나는 면
      const frontGeometry = new THREE.PlaneGeometry(6, 3)      // 6x3 비율의 사각형
      const frontMaterial = new THREE.MeshStandardMaterial({
        map: carTextureRef.current,  // 로드된 자동차 이미지 적용
        metalness: 0.3,              // 금속성 30% (약간 반사)
        roughness: 0.4,              // 거칠기 40% (매트한 표면)
        transparent: true            // 투명도 사용 가능
      })
      const frontPlane = new THREE.Mesh(frontGeometry, frontMaterial)
      frontPlane.position.set(0, 0, 0.1)  // 앞쪽으로 약간 돌출
      group.add(frontPlane)

      // [측면] 3D 깊이감을 위한 좌우 측면 패널
      const sideGeometry = new THREE.PlaneGeometry(1.5, 3)    // 좌우 측면용 사각형
      const sideMaterial = new THREE.MeshStandardMaterial({
        color: selectedTeam?.color || 0x1E3A8A,  // 팀 브랜드 색상 사용
        metalness: 0.7,   // 금속성 70% (높은 반사)
        roughness: 0.3,   // 거칠기 30% (광택 표면)
        transparent: true,
        opacity: 0.8      // 80% 불투명도
      })

      // 왼쪽 측면
      const leftSide = new THREE.Mesh(sideGeometry, sideMaterial)
      leftSide.position.set(-3.2, 0, 0)     // 왼쪽으로 이동
      leftSide.rotation.y = Math.PI / 2      // Y축 90도 회전
      group.add(leftSide)

      // 오른쪽 측면
      const rightSide = new THREE.Mesh(sideGeometry, sideMaterial)
      rightSide.position.set(3.2, 0, 0)     // 오른쪽으로 이동
      rightSide.rotation.y = -Math.PI / 2    // Y축 -90도 회전
      group.add(rightSide)

      // [상하면] 완전한 3D 박스 모양을 위한 상단/하단 면
      const topBottomGeometry = new THREE.PlaneGeometry(6, 1.5)  // 상하 면용 사각형
      const topBottomMaterial = new THREE.MeshStandardMaterial({
        color: selectedTeam?.color || 0x1E3A8A,  // 팀 브랜드 색상
        metalness: 0.8,    // 금속성 80% (매우 반사적)
        roughness: 0.2,    // 거칠기 20% (매우 부드러운 표면)
        transparent: true,
        opacity: 0.6       // 60% 불투명도
      })

      // 상단 면 (지다/루프)
      const top = new THREE.Mesh(topBottomGeometry, topBottomMaterial)
      top.position.set(0, 1.6, 0)      // 위쪽으로 이동
      top.rotation.x = -Math.PI / 2     // X축 -90도 회전 (수평으로)
      group.add(top)

      // 하단 면 (바닥/언더플로어)
      const bottom = new THREE.Mesh(topBottomGeometry, topBottomMaterial)
      bottom.position.set(0, -1.6, 0)   // 아래쪽으로 이동
      bottom.rotation.x = Math.PI / 2    // X축 90도 회전 (수평으로)
      group.add(bottom)
    }


    // [그룹 등록] 완성된 3D 자동차 모델을 장면에 추가
    carRef.current = group
    sceneRef.current.add(carRef.current)
  }, [selectedTeam])

  // [3D 애니메이션] 3D 자동차의 생동감 있는 움직임 효과
  const animate = useCallback(() => {
    const animateLoop = () => {
      animationIdRef.current = requestAnimationFrame(animateLoop)

      // [컨트롤 업데이트] 마우스 컨트롤 상태 업데이트
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      // [3D 자동차 움직임] 계속 회전하며 둥둥 떠다니는 효과
      if (carRef.current) {
        // Y축 천천히 회전 (자동차가 돌아가며 보임)
        carRef.current.rotation.y += 0.005

        // 둥둥 떠다니는 효과 (Y축 상하 움직임)
        carRef.current.position.y = Math.sin(Date.now() * 0.0008) * 0.2

        // 미세한 기울임 효과 (생동감 있는 움직임)
        carRef.current.rotation.x = Math.sin(Date.now() * 0.0006) * 0.05  // X축 미세한 기울임
        carRef.current.rotation.z = Math.cos(Date.now() * 0.0004) * 0.03  // Z축 미세한 비틀림
      }

      // [렌더링] 후처리 효과와 함께 3D 장면 렌더링
      if (composerRef.current && sceneRef.current && cameraRef.current) {
        composerRef.current.render()  // 블룸 효과 포함 렌더링
      }
    }

    animateLoop()
  }, [])

  // [팀 선택] 팀 카드 클릭 시 영화적 연출로 상세정보 표시
  const selectTeam = useCallback(async (team) => {
    setSelectedTeam(team)

    // [스크롤 제어] 모달 열리는 동안 배경 스크롤 방지
    document.body.style.overflow = 'hidden'

    // [단계별 애니메이션] 영화적 연출을 위한 3단계 시퀀스
    setTimeout(() => {
      setCarEntering(true)    // 1단계: 자동차가 화면 왼쪽에서 등장
    }, 50)

    setTimeout(() => {
      setCarCentered(true)    // 2단계: 자동차가 중앙에 위치 + 확대
    }, 800)

    setTimeout(() => {
      setPanelsAssembling(true) // 3단계: 정보 패널들이 사방에서 날아와서 조립
    }, 1200)
  }, [])

  const closeModal = useCallback(() => {
    // 스크롤 복원
    document.body.style.overflow = ''

    // 애니메이션 상태 초기화
    setCarEntering(false)
    setCarCentered(false)
    setPanelsAssembling(false)

    setTimeout(() => {
      setSelectedTeam(null)
    }, 300)
  }, [])

  // Teams 3D 설정
  const initTeams3D = useCallback(() => {
    if (!teamsCanvasRef.current) return

    // Three.js 기본 설정
    teamsSceneRef.current = new THREE.Scene()

    teamsCameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    teamsCameraRef.current.position.set(0, 0, 15)

    teamsRendererRef.current = new THREE.WebGLRenderer({ canvas: teamsCanvasRef.current, alpha: true, antialias: true })
    teamsRendererRef.current.setSize(window.innerWidth, window.innerHeight)
    teamsRendererRef.current.setPixelRatio(window.devicePixelRatio)

    // 마우스 레이캐스팅
    raycasterRef.current = new THREE.Raycaster()
    mouseRef.current = new THREE.Vector2()

    // 팀 구체들 생성
    createTeamSpheres()

    // 애니메이션 시작
    animateTeamSpheres()
  }, [])

  const createTeamSpheres = useCallback(() => {
    return // 비활성화
    teams.forEach((team, index) => {
      // 구체 기하학과 재질
      const geometry = new THREE.SphereGeometry(0.8, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: team.color,
        metalness: 0.7,
        roughness: 0.2,
        emissive: new THREE.Color(team.color).multiplyScalar(0.1)
      })

      const sphere = new THREE.Mesh(geometry, material)

      // 초기 위치 (원형으로 배치)
      const angle = (index / teams.length) * Math.PI * 2
      const radius = 6
      sphere.position.x = Math.cos(angle) * radius
      sphere.position.y = Math.sin(angle) * radius * 0.5
      sphere.position.z = Math.random() * 4 - 2

      // 초기 속도
      sphere.userData = {
        team: team,
        velocity: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.01
        },
        originalPosition: sphere.position.clone(),
        hovered: false
      }

      teamSpheresRef.current.push(sphere)
      teamsSceneRef.current.add(sphere)
    })

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    teamsSceneRef.current.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    teamsSceneRef.current.add(directionalLight)
  }, [teams])

  const animateTeamSpheres = useCallback(() => {
    const animateLoop = () => {
      teamsAnimationIdRef.current = requestAnimationFrame(animateLoop)

      // 각 구체 애니메이션
      teamSpheresRef.current.forEach((sphere) => {
        const { velocity } = sphere.userData

        // 위치 업데이트 (바운싱 효과)
        sphere.position.add(new THREE.Vector3(velocity.x, velocity.y, velocity.z))

        // 경계 충돌 처리
        if (Math.abs(sphere.position.x) > 8) velocity.x *= -1
        if (Math.abs(sphere.position.y) > 4) velocity.y *= -1
        if (Math.abs(sphere.position.z) > 3) velocity.z *= -1

        // 느린 회전
        sphere.rotation.x += 0.01
        sphere.rotation.y += 0.01

        // 호버 효과
        if (sphere.userData.hovered) {
          sphere.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1)
        } else {
          sphere.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        }
      })

      teamsRendererRef.current.render(teamsSceneRef.current, teamsCameraRef.current)
    }

    animateLoop()
  }, [])

  const onTeamSphereClick = useCallback((event) => {
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, teamsCameraRef.current)
    const intersects = raycasterRef.current.intersectObjects(teamSpheresRef.current)

    if (intersects.length > 0) {
      const clickedSphere = intersects[0].object
      const team = clickedSphere.userData.team
      selectTeam(team)
    }
  }, [selectTeam])

  const onTeamSphereHover = useCallback((event) => {
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, teamsCameraRef.current)
    const intersects = raycasterRef.current.intersectObjects(teamSpheresRef.current)

    // 모든 구체 호버 상태 초기화
    teamSpheresRef.current.forEach(sphere => {
      sphere.userData.hovered = false
    })

    if (intersects.length > 0) {
      const hoveredSphere = intersects[0].object
      hoveredSphere.userData.hovered = true
      setHoveredTeam(hoveredSphere.userData.team)
      document.body.style.cursor = 'pointer'
    } else {
      setHoveredTeam(null)
      document.body.style.cursor = 'default'
    }
  }, [])

  const onTeamsResize = useCallback(() => {
    if (!teamsCameraRef.current || !teamsRendererRef.current) return

    teamsCameraRef.current.aspect = window.innerWidth / window.innerHeight
    teamsCameraRef.current.updateProjectionMatrix()
    teamsRendererRef.current.setSize(window.innerWidth, window.innerHeight)
  }, [])

  useEffect(() => {
    // Teams 3D 초기화
    initTeams3D()

    const canvas = teamsCanvasRef.current
    if (canvas) {
      canvas.addEventListener('click', onTeamSphereClick)
      canvas.addEventListener('mousemove', onTeamSphereHover)
    }

    window.addEventListener('resize', onTeamsResize)

    return () => {
      window.removeEventListener('resize', onTeamsResize)

      if (canvas) {
        canvas.removeEventListener('click', onTeamSphereClick)
        canvas.removeEventListener('mousemove', onTeamSphereHover)
      }

      // Teams 3D 정리
      if (teamsAnimationIdRef.current) {
        cancelAnimationFrame(teamsAnimationIdRef.current)
      }
      if (teamsRendererRef.current) {
        teamsRendererRef.current.dispose()
      }

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (composerRef.current) {
        composerRef.current.dispose()
      }
      if (carTextureRef.current) {
        carTextureRef.current.dispose()
      }
    }
  }, [initTeams3D, onTeamSphereClick, onTeamSphereHover, onTeamsResize])

  return (
    <div className="teams-container">
      {/* Teams 3D Canvas - Background */}
      <canvas ref={teamsCanvasRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }} />

      <div className="teams-grid">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`team-card ${selectedTeam?.id === team.id ? 'active' : ''} ${hoveredTeam?.id === team.id ? 'hovered' : ''}`}
            style={{
              '--card-index': index % 3,
              '--team-primary': getTeamColors(team.id).primary,
              '--team-secondary': getTeamColors(team.id).secondary,
              '--team-accent': getTeamColors(team.id).accent
            }}
            onClick={() => selectTeam(team)}
            onMouseEnter={() => setHoveredTeam(team)}
            onMouseLeave={() => setHoveredTeam(null)}
          >
            <div className="team-card-inner">
              <img src={getTeamLogo(team.logo)} alt={team.name} className="team-logo-circle" />
            </div>
          </div>
        ))}
      </div>

      {/* 자동차 + 상세정보 애니메이션 */}
      {selectedTeam && (
        <div className="car-detail-animation" onClick={closeModal}>
          {/* 닫기 버튼 */}
          <button className="close-btn" onClick={closeModal}>&times;</button>

          {/* 자동차 이미지 */}
          <div className={`animated-car ${carEntering ? 'car-entering' : ''} ${carCentered ? 'car-centered' : ''}`}>
            <img src={getCarImage(selectedTeam.carImage)} alt={selectedTeam.name} className="car-image" />

            {/* 공기역학 흐름 */}
            <div className="airflow-container">
              {/* 위쪽 흐름선들 */}
              <div className="airflow-line upper-flow-1"></div>
              <div className="airflow-line upper-flow-2"></div>
              <div className="airflow-line upper-flow-3"></div>

              {/* 아래쪽 흐름선들 */}
              <div className="airflow-line lower-flow-1"></div>
              <div className="airflow-line lower-flow-2"></div>
              <div className="airflow-line lower-flow-3"></div>
            </div>
          </div>

          {/* 상세정보 패널들 */}
          <div className={`info-panels ${panelsAssembling ? 'panels-assembling' : ''}`}>
            {/* 팀 헤더 패널 */}
            <div className="info-panel team-header-panel" style={{ '--delay': '0.2s', '--team-color': getTeamColors(selectedTeam.id).primary }}>
              <img src={getTeamLogo(selectedTeam.logo)} alt={selectedTeam.name} className="team-logo-large" />
              <div className="team-title">
                <h2>{selectedTeam.name}</h2>
                <p>{selectedTeam.country}</p>
              </div>
            </div>

            {/* 슬로건 패널 */}
            <div className="info-panel slogan-panel" style={{ '--delay': '0.4s', '--team-color': getTeamColors(selectedTeam.id).primary }}>
              <p className="slogan">"{selectedTeam.slogan}"</p>
              <p className="founded">{selectedTeam.founded} | {selectedTeam.teamPrincipal}</p>
            </div>

            {/* 성과 패널 */}
            <div className="info-panel stats-panel" style={{ '--delay': '0.6s', '--team-color': getTeamColors(selectedTeam.id).primary }}>
              <div className="stat-item">
                <span className="stat-number">{selectedTeam.championships}</span>
                <span className="stat-label">Championships</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{selectedTeam.wins}</span>
                <span className="stat-label">Wins</span>
              </div>
            </div>

            {/* 기술 스펙 패널 */}
            <div className="info-panel tech-panel" style={{ '--delay': '0.8s' }}>
              <div className="tech-item">
                <span>엔진:</span> <span>{selectedTeam.engine}</span>
              </div>
              <div className="tech-item">
                <span>최고속도:</span> <span>{selectedTeam.avgSpeed}</span>
              </div>
              <div className="tech-item">
                <span>연료효율:</span> <span>{selectedTeam.fuelEfficiency}</span>
              </div>
              <div className="tech-item">
                <span>핵심기술:</span> <span>{selectedTeam.technology}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .teams-container {
          padding: 2rem;
          background: transparent;
          min-height: 100vh;
          position: relative;
        }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(2, 120px);
          justify-content: flex-start;
          align-items: center;
          gap: 2rem;
          max-width: 300px;
          margin: 0rem 0 0 4rem;
          padding: 2rem 0;
          position: relative;
          z-index: 2;
        }

        .team-card {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle,
            var(--team-primary, #1E3A8A),
            var(--team-secondary, #000000));
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 3px solid var(--team-accent, #FFD700);
          backdrop-filter: blur(15px);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .team-logo-circle {
          width: 60px;
          height: 60px;
          object-fit: contain;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          padding: 8px;
          z-index: 2;
        }

        .team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg,
            transparent,
            var(--team-accent, #FFD700),
            transparent);
          opacity: 0.1;
          transition: opacity 0.3s ease;
        }

        .team-card.hovered {
          transform: scale(1.2);
          border-width: 4px;
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.4),
            0 0 25px var(--team-accent, #FFD700);
          z-index: 10;
        }

        .team-card.hovered::before {
          opacity: 0.3;
        }

        .team-card.active {
          border-color: #ff6b6b;
          box-shadow: 0 20px 40px rgba(255, 107, 107, 0.4);
        }

        .team-card-inner {
          position: relative;
          z-index: 2;
        }

        /* 자동차 + 상세정보 애니메이션 컨테이너 */
        .car-detail-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          overflow: hidden;
        }

        .close-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 100;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        /* 자동차 애니메이션 */
        .animated-car {
          position: absolute;
          left: -300px;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animated-car.car-entering {
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .animated-car.car-centered {
          transform: translate(-50%, -50%) scale(1.1);
        }

        .animated-car .car-image {
          width: 400px;
          height: 200px;
          object-fit: contain;
          filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
          position: relative;
          z-index: 2;
        }

        /* 공기역학 흐름 컨테이너 */
        .airflow-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        /* 공기 흐름선 기본 스타일 */
        .airflow-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ff88, transparent);
          border-radius: 1px;
          opacity: 0.6;
        }

        /* 위쪽 흐름선들 - 자동차 위쪽 공기흐름 */
        .upper-flow-1 {
          top: 35%;
          left: 25%;
          width: 350px;
          background: linear-gradient(90deg, #00d2ff, transparent);
          animation: flowLeft 2s linear infinite;
          animation-delay: 0s;
          transform: rotate(-12deg);
        }

        .upper-flow-2 {
          top: 38%;
          left: 30%;
          width: 320px;
          background: linear-gradient(90deg, #0090ff, transparent);
          animation: flowLeft 2s linear infinite;
          animation-delay: 0.3s;
          transform: rotate(-6deg);
        }

        .upper-flow-3 {
          top: 42%;
          left: 35%;
          width: 300px;
          background: linear-gradient(90deg, #ff69b4, transparent);
          animation: flowLeft 2s linear infinite;
          animation-delay: 0.6s;
          transform: rotate(-2deg);
        }

        /* 아래쪽 흐름선들 - 자동차 아래쪽 공기흐름 */
        .lower-flow-1 {
          top: 58%;
          left: 35%;
          width: 300px;
          background: linear-gradient(90deg, #ffd700, transparent);
          animation: flowLeft 2s linear infinite;
          animation-delay: 0.9s;
          transform: rotate(2deg);
        }

        .lower-flow-2 {
          top: 62%;
          left: 30%;
          width: 320px;
          background: linear-gradient(90deg, #ff8700, transparent);
          animation: flowLeft 2s linear infinite;
          animation-delay: 1.2s;
          transform: rotate(6deg);
        }

        .lower-flow-3 {
          top: 65%;
          left: 25%;
          width: 350px;
          background: linear-gradient(90deg, #9370db, transparent);
          animation: flowLeft 2s linear infinite;
          animation-delay: 1.5s;
          transform: rotate(12deg);
        }

        /* 애니메이션 키프레임 */
        @keyframes flowLeft {
          0% {
            transform: translateX(-300px) scaleX(0);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
            transform: translateX(-200px) scaleX(1);
          }
          80% {
            opacity: 0.8;
            transform: translateX(50px) scaleX(1.5);
          }
          100% {
            opacity: 0;
            transform: translateX(200px) scaleX(0.5);
          }
        }

        /* 자동차가 중앙에 위치했을 때 공기역학 효과 활성화 */
        .car-centered .airflow-container {
          opacity: 1;
        }

        /* 정보 패널들 */
        .info-panels {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 1000px;
          height: 500px;
        }

        .info-panel {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1.2rem;
          color: white;
          opacity: 0;
          transform: scale(0.8) translateY(10px);
          transition: all 0.4s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .panels-assembling .info-panel {
          opacity: 1;
          transform: scale(1) translateY(0px);
          transition-delay: var(--delay);
        }

        /* 개별 패널 위치 */
        .team-header-panel {
          top: -120px;
          right: -200px;
          transform: scale(0.5) rotateY(90deg);
          width: 300px;
          text-align: center;
        }

        .panels-assembling .team-header-panel {
          transform: scale(1) rotateY(0deg);
          right: 20px;
        }

        .slogan-panel {
          bottom: -50px;
          right: -300px;
          width: 280px;
        }

        .panels-assembling .slogan-panel {
          right: -20px;
        }

        .stats-panel {
          bottom: -150px;
          left: 50%;
          transform: translateX(-50%) scale(0.5) rotateY(90deg);
          width: 400px;
          display: flex;
          justify-content: space-around;
          padding: 2rem 1.5rem;
        }

        .panels-assembling .stats-panel {
          transform: translateX(-50%) scale(1) rotateY(0deg);
        }

        .tech-panel {
          top: -30px;
          left: -380px;
          width: 300px;
        }

        .panels-assembling .tech-panel {
          left: -100px;
        }

        /* 패널 내부 스타일 */
        .team-logo-large {
          width: 100px;
          height: 100px;
          border-radius: 20px;
          margin-bottom: 1rem;
          padding: 10px;
          background: rgba(255, 255, 255, 0.95);
        }

        .team-title h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          color: var(--team-color, #00d2ff);
          font-weight: bold;
        }

        .slogan {
          font-size: 1.2rem;
          font-style: italic;
          color: var(--team-color, #ffd700);
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .founded {
          font-size: 0.9rem;
          color: #ccc;
          text-align: center;
          margin: 0;
        }

        .stat-item {
          text-align: center;
          flex: 1;
          padding: 0 1rem;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: #ccc;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .tech-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          font-size: 0.9rem;
        }

        .tech-item span:first-child {
          color: #ccc;
        }

        .tech-item span:last-child {
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

export default Teams
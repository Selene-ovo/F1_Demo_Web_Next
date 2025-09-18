'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import Image from 'next/image'

export default function Circuit() {
  const globeCanvasRef = useRef(null)
  const [selectedCircuit, setSelectedCircuit] = useState(null)
  const [showPanel, setShowPanel] = useState(false)
  const [isInCircuitSection, setIsInCircuitSection] = useState(true)
  const [hoveredCircuit, setHoveredCircuit] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Three.js 관련 변수들
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const globeRef = useRef(null)
  const markersRef = useRef([])
  const cloudsRef = useRef(null)
  const isDraggingRef = useRef(false)
  const previousMousePositionRef = useRef({ x: 0, y: 0 })
  const globeRotationRef = useRef({ x: 0, y: 0 })
  const dragDistanceRef = useRef(0)
  const isZoomedRef = useRef(false)
  const originalCameraPositionRef = useRef(new THREE.Vector3(0, 0, 2.5))

  // 2025 F1 서킷 데이터 (24개)
  const f1Circuits = [
    {
      id: 1,
      name: '바레인 국제 서킷',
      country: '바레인',
      city: '사키르',
      lat: 26.0325,
      lng: 50.5106,
      lapRecord: '1:31.447',
      length: '5.412km',
      corners: 15,
      drs: 3,
      flag: 'https://flagcdn.com/w320/bh.png',
      circuitImage: '/assets/images/circuits/Bahrain.svg',
      backgroundImage: '/assets/images/circuits/Bahrain_B.webp',
      description: '사막 한가운데 위치한 야간 레이스로 유명한 서킷입니다.',
      features: ['야간 레이스', '사막 서킷', '고속 백스트레이트', 'DRS 오버테이킹 존']
    },
    {
      id: 2,
      name: '제다 코니시 서킷',
      country: '사우디아라비아',
      city: '제다',
      lat: 21.6319,
      lng: 39.1044,
      lapRecord: '1:30.734',
      length: '6.174km',
      corners: 27,
      drs: 3,
      flag: 'https://flagcdn.com/w320/sa.png',
      circuitImage: '/assets/images/circuits/Jeddah.webp',
      backgroundImage: '/assets/images/circuits/Jeddah_B.svg',
      description: '세계에서 가장 빠른 시가지 서킷 중 하나입니다.',
      features: ['시가지 서킷', '고속 코너들', '야간 레이스', '가장 긴 F1 서킷']
    },
    {
      id: 3,
      name: '알버트 파크 서킷',
      country: '호주',
      city: '멜버른',
      lat: -37.8497,
      lng: 144.9680,
      lapRecord: '1:20.260',
      length: '5.278km',
      corners: 14,
      drs: 2,
      flag: 'https://flagcdn.com/w320/au.png',
      circuitImage: '/assets/images/circuits/Albert_Park.webp',
      backgroundImage: '/assets/images/circuits/Albert_Park_B.webp',
      description: '아름다운 호수를 끼고 있는 클래식한 서킷입니다.',
      features: ['공원 내 서킷', '호수 뷰', '클래식 레이아웃', '시즌 오프너']
    },
    {
      id: 4,
      name: '스즈카 서킷',
      country: '일본',
      city: '스즈카',
      lat: 34.8431,
      lng: 136.5407,
      lapRecord: '1:30.983',
      length: '5.807km',
      corners: 18,
      drs: 1,
      flag: 'https://flagcdn.com/w320/jp.png',
      circuitImage: '/assets/images/circuits/Suzuka.webp',
      backgroundImage: '/assets/images/circuits/Suzuka_B.svg',
      description: '피겨 8 레이아웃의 기술적인 서킷으로 드라이버들이 가장 좋아합니다.',
      features: ['피겨 8 레이아웃', '130R 고속 코너', '기술적 서킷', '드라이버 선호 1위']
    },
    {
      id: 5,
      name: '상하이 인터내셔널 서킷',
      country: '중국',
      city: '상하이',
      lat: 31.3389,
      lng: 121.2197,
      lapRecord: '1:32.238',
      length: '5.451km',
      corners: 16,
      drs: 2,
      flag: 'https://flagcdn.com/w320/cn.png',
      circuitImage: '/assets/images/circuits/ShangHai.webp',
      backgroundImage: '/assets/images/circuits/ShangHai_B.webp',
      description: '독특한 코르크스크류 섹션이 있는 현대적인 서킷입니다.',
      features: ['코르크스크류 코너', '긴 백스트레이트', '현대적 설계', '상하이 스카이라인']
    },
    {
      id: 6,
      name: '마이애미 인터내셔널 오토드롬',
      country: '미국',
      city: '마이애미',
      lat: 25.9581,
      lng: -80.2389,
      lapRecord: '1:29.708',
      length: '5.41km',
      corners: 19,
      drs: 3,
      flag: 'https://flagcdn.com/w320/us.png',
      circuitImage: '/assets/images/circuits/Miami.webp',
      backgroundImage: '/assets/images/circuits/Miami_B.webp',
      description: '하드락 스타디움 주변을 도는 화려한 시가지 서킷입니다.',
      features: ['시가지 서킷', '하드락 스타디움', '마리나 뷰', '글래머러스한 분위기']
    },
    {
      id: 7,
      name: '이몰라 서킷',
      country: '이탈리아',
      city: '이몰라',
      lat: 44.3439,
      lng: 11.7167,
      lapRecord: '1:15.484',
      length: '4.909km',
      corners: 19,
      drs: 2,
      flag: 'https://flagcdn.com/w320/it.png',
      circuitImage: '/assets/images/circuits/Autodromo.webp',
      backgroundImage: '/assets/images/circuits/Autodromo_B.webp',
      description: '클래식한 유럽 스타일의 좁고 기술적인 서킷입니다.',
      features: ['클래식 유럽 서킷', '좁은 트랙', '기술적 레이아웃', '역사적 의미']
    },
    {
      id: 8,
      name: '몬테카를로 서킷',
      country: '모나코',
      city: '몬테카를로',
      lat: 43.7347,
      lng: 7.4206,
      lapRecord: '1:12.909',
      length: '3.337km',
      corners: 19,
      drs: 1,
      flag: 'https://flagcdn.com/w320/mc.png',
      circuitImage: '/assets/images/circuits/Monaco.webp',
      backgroundImage: '/assets/images/circuits/Monaco_B.svg',
      description: 'F1에서 가장 프레스티지 있는 레이스가 열리는 좁은 시가지 서킷입니다.',
      features: ['가장 느린 서킷', '시가지 레이스', '프레스티지', '카지노 스퀘어']
    },
    {
      id: 9,
      name: '질 빌르뇌브 서킷',
      country: '캐나다',
      city: '몬트리올',
      lat: 45.5050,
      lng: -73.5228,
      lapRecord: '1:13.078',
      length: '4.361km',
      corners: 14,
      drs: 1,
      flag: 'https://flagcdn.com/w320/ca.png',
      circuitImage: '/assets/images/circuits/Gilles.webp',
      backgroundImage: '/assets/images/circuits/Gilles_B.webp',
      description: '벽이 가까운 반영구 서킷으로 스릴 넘치는 레이스가 펼쳐집니다.',
      features: ['벽이 가까운 서킷', '샴페인 스트레이트', '헤어핀 코너', '세인트로렌스강']
    },
    {
      id: 10,
      name: '카탈루냐 서킷',
      country: '스페인',
      city: '바르셀로나',
      lat: 41.5700,
      lng: 2.2611,
      lapRecord: '1:18.149',
      length: '4.675km',
      corners: 16,
      drs: 1,
      flag: 'https://flagcdn.com/w320/es.png',
      circuitImage: '/assets/images/circuits/Barcelona.webp',
      backgroundImage: '/assets/images/circuits/Barcelona_B.webp',
      description: '모든 종류의 코너가 있어 완벽한 테스트 서킷으로 불립니다.',
      features: ['완벽한 테스트 서킷', '모든 코너 유형', '기술적 레이아웃', '프리시즌 테스트']
    },
    {
      id: 11,
      name: '레드불 링',
      country: '오스트리아',
      city: '슈필베르크',
      lat: 47.2197,
      lng: 14.7647,
      lapRecord: '1:05.619',
      length: '4.318km',
      corners: 10,
      drs: 3,
      flag: 'https://flagcdn.com/w320/at.png',
      circuitImage: '/assets/images/circuits/Red_Bull_Ring.webp',
      backgroundImage: '/assets/images/circuits/Red_Bull_Ring_B.svg',
      description: '짧지만 스릴 넘치는 산악 지대의 고속 서킷입니다.',
      features: ['가장 짧은 서킷', '산악 지대', '고속 레이아웃', '아름다운 풍경']
    },
    {
      id: 12,
      name: '실버스톤 서킷',
      country: '영국',
      city: '실버스톤',
      lat: 52.0786,
      lng: -1.0169,
      lapRecord: '1:27.097',
      length: '5.891km',
      corners: 18,
      drs: 2,
      flag: 'https://flagcdn.com/w320/gb.png',
      circuitImage: '/assets/images/circuits/SilverStone.webp',
      backgroundImage: '/assets/images/circuits/SilverStone_B.webp',
      description: 'F1의 본고장으로 불리는 고속 코너들의 메카입니다.',
      features: ['F1의 본고장', '고속 코너들', '코프스 코너', '클럽 코너']
    },
    {
      id: 13,
      name: '헝가로링',
      country: '헝가리',
      city: '부다페스트',
      lat: 47.5789,
      lng: 19.2486,
      lapRecord: '1:16.627',
      length: '4.381km',
      corners: 14,
      drs: 1,
      flag: 'https://flagcdn.com/w320/hu.png',
      circuitImage: '/assets/images/circuits/Hungaroring.webp',
      backgroundImage: '/assets/images/circuits/Hungaroring_B.webp',
      description: '좁고 기술적인 서킷으로 오버테이킹이 어려워 전략이 중요합니다.',
      features: ['기술적 서킷', '오버테이킹 어려움', '전략적 레이스', '여름 레이스']
    },
    {
      id: 14,
      name: '스파-프랑코샹',
      country: '벨기에',
      city: '스파',
      lat: 50.4372,
      lng: 5.9714,
      lapRecord: '1:46.286',
      length: '7.004km',
      corners: 19,
      drs: 2,
      flag: 'https://flagcdn.com/w320/be.png',
      circuitImage: '/assets/images/circuits/Francorchamps.svg',
      backgroundImage: '/assets/images/circuits/Francorchamps_B.webp',
      description: '가장 긴 서킷으로 오 루즈 코너가 유명하며 날씨 변화가 심합니다.',
      features: ['가장 긴 서킷', '오 루즈 코너', '날씨 변화', '클래식 서킷']
    },
    {
      id: 15,
      name: '잔트보르트 서킷',
      country: '네덜란드',
      city: '잔트보르트',
      lat: 52.3888,
      lng: 4.5408,
      lapRecord: '1:11.097',
      length: '4.259km',
      corners: 14,
      drs: 1,
      flag: 'https://flagcdn.com/w320/nl.png',
      circuitImage: '/assets/images/circuits/Zandvoort.webp',
      backgroundImage: '/assets/images/circuits/Zandvoort_B.webp',
      description: '뱅크드 코너가 특징인 클래식 서킷으로 오렌지 군단의 열기가 뜨겁습니다.',
      features: ['뱅크드 코너', '오렌지 군단', '클래식 서킷', '해안가 위치']
    },
    {
      id: 16,
      name: '몬자 서킷',
      country: '이탈리아',
      city: '몬자',
      lat: 45.6156,
      lng: 9.2811,
      lapRecord: '1:21.046',
      length: '5.793km',
      corners: 11,
      drs: 3,
      flag: 'https://flagcdn.com/w320/it.png',
      circuitImage: '/assets/images/circuits/Monza.webp',
      backgroundImage: '/assets/images/circuits/Monza_B.webp',
      description: '스피드의 사원으로 불리는 F1에서 가장 빠른 서킷입니다.',
      features: ['가장 빠른 서킷', '스피드의 사원', '긴 스트레이트', '파라볼리카 코너']
    },
    {
      id: 17,
      name: '바쿠 시티 서킷',
      country: '아제르바이잔',
      city: '바쿠',
      lat: 40.3725,
      lng: 49.8533,
      lapRecord: '1:43.009',
      length: '6.003km',
      corners: 20,
      drs: 2,
      flag: 'https://flagcdn.com/w320/az.png',
      circuitImage: '/assets/images/circuits/Baku.webp',
      backgroundImage: '/assets/images/circuits/Baku_B.webp',
      description: '긴 메인 스트레이트와 좁은 구시가지를 오가는 독특한 시가지 서킷입니다.',
      features: ['긴 메인 스트레이트', '구시가지 구간', '시가지 서킷', '캐슬 섹션']
    },
    {
      id: 18,
      name: '마리나 베이 서킷',
      country: '싱가포르',
      city: '싱가포르',
      lat: 1.2914,
      lng: 103.8640,
      lapRecord: '1:35.867',
      length: '5.063km',
      corners: 23,
      drs: 3,
      flag: 'https://flagcdn.com/w320/sg.png',
      circuitImage: '/assets/images/circuits/Marina.webp',
      backgroundImage: '/assets/images/circuits/Marina_B.webp',
      description: '세계 최초의 F1 야간 시가지 레이스가 열리는 화려한 서킷입니다.',
      features: ['야간 시가지 레이스', '높은 습도', '화려한 조명', '마리나 베이 뷰']
    },
    {
      id: 19,
      name: '서킷 오브 디 아메리카스',
      country: '미국',
      city: '오스틴',
      lat: 30.1328,
      lng: -97.6411,
      lapRecord: '1:36.169',
      length: '5.513km',
      corners: 20,
      drs: 2,
      flag: 'https://flagcdn.com/w320/us.png',
      circuitImage: '/assets/images/circuits/Americas.webp',
      backgroundImage: '/assets/images/circuits/Americas_B.svg',
      description: '상하이와 유사한 1섹터가 특징인 현대적인 미국 서킷입니다.',
      features: ['현대적 설계', '상하이식 1섹터', 'COTA', '텍사스 분위기']
    },
    {
      id: 20,
      name: '아우토드로모 에르마노스 로드리게스',
      country: '멕시코',
      city: '멕시코시티',
      lat: 19.4042,
      lng: -99.0907,
      lapRecord: '1:17.774',
      length: '4.304km',
      corners: 17,
      drs: 3,
      flag: 'https://flagcdn.com/w320/mx.png',
      circuitImage: '/assets/images/circuits/Hermanos.webp',
      backgroundImage: '/assets/images/circuits/Hermanos_B.webp',
      description: '고도 2200m의 희박한 공기에서 열리는 독특한 레이스입니다.',
      features: ['고도 2200m', '희박한 공기', '스타디움 섹션', '멕시코 열정']
    },
    {
      id: 21,
      name: '인터라고스',
      country: '브라질',
      city: '상파울루',
      lat: -23.7036,
      lng: -46.6997,
      lapRecord: '1:10.540',
      length: '4.309km',
      corners: 15,
      drs: 2,
      flag: 'https://flagcdn.com/w320/br.png',
      circuitImage: '/assets/images/circuits/Carlos.webp',
      backgroundImage: '/assets/images/circuits/Carlos_B.webp',
      description: '역주행 레이아웃과 예측 불가능한 날씨로 유명한 클래식 서킷입니다.',
      features: ['역주행 레이아웃', '예측불가 날씨', '세나 S자', '브라질 열정']
    },
    {
      id: 22,
      name: '라스베이거스 스트립 서킷',
      country: '미국',
      city: '라스베이거스',
      lat: 36.1147,
      lng: -115.1728,
      lapRecord: '1:35.490',
      length: '6.201km',
      corners: 17,
      drs: 3,
      flag: 'https://flagcdn.com/w320/us.png',
      circuitImage: '/assets/images/circuits/Las_Vegas.webp',
      backgroundImage: '/assets/images/circuits/Las_Vegas_B.webp',
      description: '화려한 라스베이거스 스트립을 달리는 환상적인 야간 시가지 서킷입니다.',
      features: ['라스베이거스 스트립', '야간 시가지', '긴 스트레이트', '카지노 뷰']
    },
    {
      id: 23,
      name: '루사일 인터내셔널 서킷',
      country: '카타르',
      city: '루사일',
      lat: 25.4901,
      lng: 51.4542,
      lapRecord: '1:24.319',
      length: '5.380km',
      corners: 16,
      drs: 2,
      flag: 'https://flagcdn.com/w320/qa.png',
      circuitImage: '/assets/images/circuits/Lusail.webp',
      backgroundImage: '/assets/images/circuits/Lusail_B.webp',
      description: '사막의 현대적 서킷으로 스프린트 포맷이 적용됩니다.',
      features: ['사막 서킷', '스프린트 포맷', '현대적 시설', '중동 허브']
    },
    {
      id: 24,
      name: '야스 마리나 서킷',
      country: '아랍에미리트',
      city: '아부다비',
      lat: 24.4672,
      lng: 54.6031,
      lapRecord: '1:26.103',
      length: '5.281km',
      corners: 16,
      drs: 2,
      flag: 'https://flagcdn.com/w320/ae.png',
      circuitImage: '/assets/images/circuits/Yas_Marina.webp',
      backgroundImage: '/assets/images/circuits/Yas_Marina_B.webp',
      description: '화려한 시설과 함께 F1 시즌 피날레를 장식하는 야간 서킷입니다.',
      features: ['시즌 피날레', '야간 레이스', '화려한 시설', '더블 포인트 가능성']
    }
  ]

  const initThreeJS = useCallback(() => {
    const canvas = globeCanvasRef.current
    if (!canvas) return

    // Scene 설정
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(800, 800)
    renderer.setClearColor(0x000000, 0)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // 지구 생성
    createGlobe(scene)

    // F1 서킷 마커 생성
    createCircuitMarkers(scene)

    // 카메라 초기 위치 (중앙에 고정)
    camera.position.set(0, 0, 2.5)
    camera.lookAt(0, 0, 0)

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // 애니메이션 시작
    animate()
  }, [])

  const createGlobe = (scene) => {
    console.log('지구본 생성 시작')

    // 지구 지오메트리와 텍스처
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64)

    // 실제 지구 텍스처 사용
    const textureLoader = new THREE.TextureLoader()

    const globeMaterial = new THREE.MeshPhongMaterial({
      // NASA Blue Marble 지구 텍스처 사용
      map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
      bumpMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'),
      bumpScale: 0.05,
      specularMap: textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'),
      specular: new THREE.Color('grey'),
      shininess: 100
    })

    const globe = new THREE.Mesh(globeGeometry, globeMaterial)
    globe.position.set(0, 0, 0)
    scene.add(globe)
    globeRef.current = globe

    console.log('지구본이 씬에 추가됨:', globe)

    // 구름 레이어 추가
    const cloudGeometry = new THREE.SphereGeometry(1.005, 64, 64)
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png'),
      transparent: true,
      opacity: 0.4
    })
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
    scene.add(clouds)
    cloudsRef.current = clouds
  }

  const createCircuitMarkers = (scene) => {
    f1Circuits.forEach(circuit => {
      // 위도/경도를 3D 좌표로 변환
      const phi = (90 - circuit.lat) * (Math.PI / 180)
      const theta = (circuit.lng + 180) * (Math.PI / 180)

      const x = -(1.02 * Math.sin(phi) * Math.cos(theta))
      const z = (1.02 * Math.sin(phi) * Math.sin(theta))
      const y = (1.02 * Math.cos(phi))

      // 마커 지오메트리
      const markerGeometry = new THREE.SphereGeometry(0.028, 12, 12)
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x22cc44
      })

      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, y, z)
      marker.userData = circuit

      // 마커를 지구에 자식으로 추가 (지구와 함께 회전)
      globeRef.current.add(marker)
      markersRef.current.push({ marker, circuit })

      // 펄싱 애니메이션
      const originalScale = marker.scale.x
      marker.userData.pulsePhase = Math.random() * Math.PI * 2
    })
  }

  const onMouseDown = (event) => {
    isDraggingRef.current = true
    dragDistanceRef.current = 0
    previousMousePositionRef.current = {
      x: event.clientX,
      y: event.clientY
    }
  }

  const onMouseMove = (event) => {
    // 툴팁 위치 업데이트 (화면 경계 고려)
    const tooltipWidth = 250
    const tooltipHeight = 150
    let x = event.clientX + 15
    let y = event.clientY - 15

    // 오른쪽 경계 확인
    if (x + tooltipWidth > window.innerWidth) {
      x = event.clientX - tooltipWidth - 15
    }

    // 위쪽 경계 확인
    if (y - tooltipHeight < 0) {
      y = event.clientY + 15
    }

    setTooltipPosition({ x, y })

    // 드래그 중이 아닐 때만 호버 감지
    if (!isDraggingRef.current) {
      checkMarkerHover(event)
    }

    // 드래그 처리
    if (isDraggingRef.current) {
      const deltaMove = {
        x: event.clientX - previousMousePositionRef.current.x,
        y: event.clientY - previousMousePositionRef.current.y
      }

      // 드래그 거리 계산
      dragDistanceRef.current += Math.abs(deltaMove.x) + Math.abs(deltaMove.y)

      // 지구 회전 속도 조정 (더 느리게, 자연스러운 방향)
      globeRotationRef.current.y += deltaMove.x * 0.003
      globeRotationRef.current.x += deltaMove.y * 0.003

      // X축 회전 제한
      globeRotationRef.current.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, globeRotationRef.current.x))

      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY
      }
    }
  }

  const onMouseUp = () => {
    isDraggingRef.current = false
  }

  const checkMarkerHover = (event) => {
    const canvas = globeCanvasRef.current
    if (!canvas || !cameraRef.current) return

    const rect = canvas.getBoundingClientRect()
    const mouse = new THREE.Vector2()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, cameraRef.current)

    // 레이캐스터 감지 범위 늘리기
    raycaster.params.Points.threshold = 0.1
    raycaster.far = 1000

    const markerObjects = markersRef.current.map(m => m.marker)
    const intersects = raycaster.intersectObjects(markerObjects, true)

    if (intersects.length > 0) {
      const hoveredMarker = intersects[0].object
      setHoveredCircuit(hoveredMarker.userData)
      console.log('호버 감지:', hoveredMarker.userData.name)
    } else {
      if (hoveredCircuit) {
        console.log('호버 해제')
      }
      setHoveredCircuit(null)
    }
  }

  const onMouseLeave = () => {
    setHoveredCircuit(null)
  }

  const onMouseClick = (event) => {
    if (dragDistanceRef.current > 3) return

    const canvas = globeCanvasRef.current
    if (!canvas || !cameraRef.current) return

    const rect = canvas.getBoundingClientRect()
    const mouse = new THREE.Vector2()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, cameraRef.current)

    const markerObjects = markersRef.current.map(m => m.marker)
    const intersects = raycaster.intersectObjects(markerObjects, true)

    if (intersects.length > 0) {
      const clickedMarker = intersects[0].object
      console.log('클릭된 서킷:', clickedMarker.userData.name)
      console.log('isInCircuitSection:', isInCircuitSection)
      selectCircuit(clickedMarker.userData)
      zoomToMarker(clickedMarker.getWorldPosition(new THREE.Vector3()))
    } else {
      if (isZoomedRef.current && selectedCircuit) {
        closePanel()
      }
    }
  }

  const selectCircuit = (circuit) => {
    console.log('selectCircuit 호출:', circuit.name)
    console.log('showPanel 설정 전:', showPanel)
    setSelectedCircuit(circuit)
    setShowPanel(true)
    console.log('showPanel 설정 후:', true)
  }

  const closePanel = () => {
    setShowPanel(false)
    resetCameraPosition()
    setTimeout(() => {
      setSelectedCircuit(null)
    }, 300)
  }

  const zoomToMarker = (markerWorldPos) => {
    if (isZoomedRef.current) {
      // 이미 줌된 상태에서 다른 마커 클릭 시 직접 전환
      performZoom(markerWorldPos)
    } else {
      performZoom(markerWorldPos)
    }
  }

  const performZoom = (markerWorldPos) => {
    isZoomedRef.current = true

    // 마커 방향으로 카메라 이동 (확대)
    const zoomDistance = 1.4
    const targetCameraPos = markerWorldPos.clone().multiplyScalar(zoomDistance)

    animateCameraTo(targetCameraPos, markerWorldPos)
  }

  const resetCameraPosition = () => {
    if (!isZoomedRef.current) return
    isZoomedRef.current = false
    animateCameraTo(originalCameraPositionRef.current.clone(), new THREE.Vector3(0, 0, 0))
  }

  const animateCameraTo = (targetPos, lookAtPos) => {
    const startPosition = cameraRef.current.position.clone()
    let progress = 0

    const animateCamera = () => {
      progress += 0.04
      if (progress <= 1) {
        cameraRef.current.position.lerpVectors(startPosition, targetPos, progress)
        cameraRef.current.lookAt(lookAtPos)
        requestAnimationFrame(animateCamera)
      }
    }
    animateCamera()
  }

  const handleImageError = (event) => {
    // 이미지 로드 실패 시 기본 색상으로 대체
    event.target.style.display = 'none'
    console.log('이미지 로드 실패:', event.target.src)
  }

  const handleTooltipImageError = (event) => {
    // 툴팁 배경 이미지 로드 실패 시 투명하게 처리
    event.target.style.opacity = '0'
    console.log('툴팁 배경 이미지 로드 실패:', event.target.src)
  }

  const animate = () => {
    animationIdRef.current = requestAnimationFrame(animate)

    const time = Date.now() * 0.001

    // 지구와 구름 회전 적용
    if (globeRef.current) {
      globeRef.current.rotation.x = globeRotationRef.current.x
      globeRef.current.rotation.y = globeRotationRef.current.y
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.x = globeRotationRef.current.x
      cloudsRef.current.rotation.y = globeRotationRef.current.y // 구름도 지구와 동일하게 회전
    }

    // 마커 크기 조정 (확대 시 더욱 작게)
    markersRef.current.forEach(({ marker }) => {
      const baseScale = isZoomedRef.current ? 0.3 : 0.8
      marker.scale.setScalar(baseScale)
    })

    if (rendererRef.current && cameraRef.current && sceneRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }

  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current || !globeCanvasRef.current) return

    const canvas = globeCanvasRef.current
    const rect = canvas.getBoundingClientRect()

    cameraRef.current.aspect = rect.width / rect.height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(rect.width, rect.height)
  }, [])

  useEffect(() => {
    // DOM이 완전히 렌더링된 후 Three.js 초기화
    const timeoutId = setTimeout(() => {
      initThreeJS()
    }, 100)

    const canvas = globeCanvasRef.current
    if (canvas) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseup', onMouseUp)
      canvas.addEventListener('click', onMouseClick)
      canvas.addEventListener('mouseleave', onMouseLeave)
    }

    // 7번 섹션 관찰자 설정
    const circuitSection = document.querySelector('.home-07')
    let observer
    if (circuitSection) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          setIsInCircuitSection(entry.isIntersecting)
          if (!entry.isIntersecting) {
            // 섹션을 벗어나면 패널 닫기
            closePanel()
          }
        })
      }, { threshold: 0.3 })

      observer.observe(circuitSection)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeoutId)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (canvas) {
        canvas.removeEventListener('mousedown', onMouseDown)
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('mouseup', onMouseUp)
        canvas.removeEventListener('click', onMouseClick)
        canvas.removeEventListener('mouseleave', onMouseLeave)
      }
      if (observer) {
        observer.disconnect()
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="threejs-globe">
      <canvas
        ref={globeCanvasRef}
        className="globe-canvas"
      />

      {/* 호버 툴팁 */}
      {hoveredCircuit && (
        <div
          className="circuit-tooltip"
          style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
        >
          <div className="tooltip-content">
            <div className="tooltip-header">
              <img src={hoveredCircuit.flag} alt={hoveredCircuit.country} className="tooltip-flag" />
              <span className="tooltip-name">{hoveredCircuit.name}</span>
            </div>
            <div className={`tooltip-image ${hoveredCircuit.country === '캐나다' ? 'white-bg' : ''}`}>
              <img
                src={hoveredCircuit.backgroundImage}
                alt={hoveredCircuit.name}
                className="circuit-bg-image"
                onError={handleTooltipImageError}
              />
            </div>
            <div className="tooltip-info">
              <div className="tooltip-stat">
                <span className="label">국가:</span>
                <span className="value">{hoveredCircuit.country}</span>
              </div>
              <div className="tooltip-stat">
                <span className="label">랩 레코드:</span>
                <span className="value">{hoveredCircuit.lapRecord}</span>
              </div>
              <div className="tooltip-stat">
                <span className="label">길이:</span>
                <span className="value">{hoveredCircuit.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 서킷 상세정보 패널 */}
      {selectedCircuit && (
        <div
          className={`circuit-info-panel ${showPanel ? 'visible' : ''}`}
        >
          <div className="panel-header">
            <h3 className="circuit-name">{selectedCircuit.name}</h3>
            <button onClick={closePanel} className="close-btn">&times;</button>
          </div>

          <div className="panel-content">
            {/* 서킷 메인 이미지 */}
            <div className={`circuit-main-image ${selectedCircuit.country === '캐나다' ? 'white-bg' : ''}`}>
              <img
                src={selectedCircuit.circuitImage}
                alt={selectedCircuit.name}
                onError={handleImageError}
                className="circuit-image"
              />
            </div>

            <div className="circuit-flag">
              <img src={selectedCircuit.flag} alt={selectedCircuit.country} className="flag-image" />
              <span className="country">{selectedCircuit.country}</span>
            </div>

            <div className="circuit-stats">
              <div className="stat">
                <span className="label">랩 레코드</span>
                <span className="value">{selectedCircuit.lapRecord}</span>
              </div>
              <div className="stat">
                <span className="label">서킷 길이</span>
                <span className="value">{selectedCircuit.length}</span>
              </div>
              <div className="stat">
                <span className="label">코너 수</span>
                <span className="value">{selectedCircuit.corners}</span>
              </div>
              <div className="stat">
                <span className="label">DRS 존</span>
                <span className="value">{selectedCircuit.drs}</span>
              </div>
            </div>

            <div className="circuit-description">
              <p>{selectedCircuit.description}</p>
            </div>

            <div className="circuit-features">
              <h4>주요 특징</h4>
              <ul>
                {selectedCircuit.features.map((feature, index) => (
                  <li key={`${selectedCircuit.id}-feature-${index}`}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .threejs-globe {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .globe-canvas {
          width: 800px;
          height: 800px;
          display: block;
          cursor: grab;
          border-radius: 50%;
        }

        .globe-canvas:active {
          cursor: grabbing;
        }

        .circuit-info-panel {
          position: fixed;
          top: 50%;
          right: -400px;
          transform: translateY(-50%);
          width: 380px;
          max-height: 80vh;
          background: rgba(10, 10, 10, 0.95);
          background-size: cover;
          background-position: center;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: white;
          transition: right 0.4s ease;
          z-index: 1000;
          overflow-y: auto;
        }

        .circuit-info-panel.visible {
          right: 20px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 16px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .circuit-name {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #00d4ff, #ffffff);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          line-height: 1.2;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .panel-content {
          padding: 24px;
        }

        .circuit-main-image {
          width: 100%;
          margin-bottom: 20px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
          aspect-ratio: auto;
        }

        .circuit-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.3s ease;
          filter: brightness(1.2) contrast(1.1);
        }

        .circuit-image:hover {
          transform: scale(1.05);
        }

        .circuit-flag {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .flag-image {
          width: 32px;
          height: 24px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .country {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .circuit-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat .label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat .value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #00d4ff;
        }

        .circuit-description {
          margin-bottom: 24px;
        }

        .circuit-description p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
        }

        .circuit-features h4 {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .circuit-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .circuit-features li {
          padding: 8px 0;
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          padding-left: 20px;
        }

        .circuit-features li:last-child {
          border-bottom: none;
        }

        .circuit-features li::before {
          content: '•';
          color: #00d4ff;
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        /* 스크롤바 스타일링 */
        .circuit-info-panel::-webkit-scrollbar {
          width: 6px;
        }

        .circuit-info-panel::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .circuit-info-panel::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.6);
          border-radius: 3px;
        }

        .circuit-info-panel::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.8);
        }

        /* 툴팁 스타일 */
        .circuit-tooltip {
          position: fixed;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 0.85rem;
          pointer-events: none;
          z-index: 99999;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          min-width: 250px;
          max-width: 300px;
          overflow: hidden;
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(10px);
        }

        .tooltip-content {
          position: relative;
          padding: 12px;
        }

        .tooltip-image {
          width: 100%;
          margin: 8px 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: auto;
          min-height: fit-content;
        }

        .circuit-bg-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          object-position: center;
          display: block;
          filter: brightness(1.2) contrast(1.1);
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tooltip-flag {
          width: 20px;
          height: 15px;
          object-fit: cover;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .tooltip-name {
          font-weight: 600;
          color: #00d4ff;
          font-size: 0.9rem;
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .tooltip-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tooltip-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tooltip-stat .label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
        }

        .tooltip-stat .value {
          color: white;
          font-weight: 500;
          font-size: 0.8rem;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        }

        /* 캐나다만 흰색 배경 */
        .white-bg {
          background: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </div>
  )
}
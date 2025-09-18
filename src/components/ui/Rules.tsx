import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import * as THREE from 'three'

// We'll need to dynamically import CSS3DRenderer and TWEEN
let CSS3DRenderer, CSS3DObject, TWEEN

const Rules = () => {
  const containerRef = useRef(null)
  const [currentView, setCurrentView] = useState('TABLE')
  const initRef = useRef(false)
  const [selectedRule, setSelectedRule] = useState(null)
  const [expandedRule, setExpandedRule] = useState(null)
  const expandedRuleRef = useRef(null)
  const [hasStartedDragging, setHasStartedDragging] = useState(false)
  const [matrixColumns, setMatrixColumns] = useState([])

  const originalPositionRef = useRef(null)
  const originalRotationRef = useRef(null)

  // Three.js refs
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const objectsRef = useRef([])
  const targetsRef = useRef({ table: [], sphere: [], helix: [], grid: [] })
  const animationIdRef = useRef(null)

  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?~`'

  // F1 카테고리별 분류
  const rules = useMemo(() => [
    // 밈 (첫 번째 행)
    {
      id: 1,
      name: 'S🅱innala',
      category: '밈',
      description: '베텔 스핀 밈',
      details: 'Sebastian Vettel spinning meme, originated from his Ferrari days when he spun frequently',
      period: 1,
      group: 1,
      color: '#ff6b35'
    },
    {
      id: 2,
      name: 'Bono My Tires',
      category: '밈',
      description: '해밀턴 타이어 불평 밈',
      details: 'Lewis Hamilton complaining about tire degradation to race engineer Bono, then setting fastest lap',
      period: 1,
      group: 2,
      color: '#ff6b35'
    },
    {
      id: 3,
      name: 'Blue Flags',
      category: '밈',
      description: '베텔 분노 무전 밈',
      details: 'Vettel angry radio: "Blue flags! Blue flags!" when stuck behind slower cars',
      period: 1,
      group: 3,
      color: '#ff6b35'
    },
    {
      id: 4,
      name: 'Simply Lovely',
      category: '밈',
      description: '키미 무표정 반응',
      details: 'Kimi Räikkönen deadpan response, became internet sensation',
      period: 1,
      group: 13,
      color: '#ff6b35'
    },
    {
      id: 5,
      name: 'Plan B',
      category: '밈',
      description: '페라리 전략 실패',
      details: 'Ferrari strategy failures, "We are checking" became a meme',
      period: 1,
      group: 14,
      color: '#ff6b35'
    },
    {
      id: 6,
      name: 'El Plan',
      category: '밈',
      description: '알론소 마스터플랜 밈',
      details: 'Fernando Alonso master plan meme, popular among fans',
      period: 1,
      group: 15,
      color: '#ff6b35'
    },

    // 용어 (두 번째 행)
    {
      id: 7,
      name: 'DRS',
      category: '용어',
      description: 'Drag Reduction System',
      details: 'Rear wing opens to reduce drag, available in designated zones when within 1s',
      period: 2,
      group: 1,
      color: '#06b6d4'
    },
    {
      id: 8,
      name: 'ERS',
      category: '용어',
      description: 'Energy Recovery System',
      details: 'Hybrid power unit: 160hp boost for 33.3s per lap from MGU-K and MGU-H',
      period: 2,
      group: 2,
      color: '#06b6d4'
    },
    {
      id: 9,
      name: 'Porpoising',
      category: '용어',
      description: '2022년 바운싱 현상',
      details: 'Aerodynamic bouncing effect with ground effect cars, major issue in 2022',
      period: 2,
      group: 3,
      color: '#06b6d4'
    },
    {
      id: 10,
      name: 'Dirty Air',
      category: '용어',
      description: '난기류로 인한 다운포스 손실',
      details: 'Turbulent air behind cars reduces downforce, makes overtaking difficult',
      period: 2,
      group: 4,
      color: '#06b6d4'
    },
    {
      id: 11,
      name: 'Slipstream',
      category: '용어',
      description: '후류를 이용한 속도 증가',
      details: 'Following closely behind reduces drag, increases top speed for overtaking',
      period: 2,
      group: 13,
      color: '#06b6d4'
    },
    {
      id: 12,
      name: 'Undercut',
      category: '용어',
      description: '일찍 피트인으로 앞서기',
      details: 'Early pit stop strategy to gain track position with fresher tires',
      period: 2,
      group: 14,
      color: '#06b6d4'
    },
    {
      id: 13,
      name: 'Overcut',
      category: '용어',
      description: 'Late pit stop strategy',
      details: 'Late pit stop strategy, staying out longer to gain advantage',
      period: 2,
      group: 15,
      color: '#06b6d4'
    },
    {
      id: 14,
      name: 'Box Box',
      category: '용어',
      description: '피트인 신호',
      details: 'Radio call for driver to enter pit lane for pit stop',
      period: 2,
      group: 16,
      color: '#06b6d4'
    },

    // 경기 규칙 (세 번째 행)
    {
      id: 15,
      name: 'Qualifying',
      category: '경기규칙',
      description: '3단계 예선 시스템',
      details: 'Q1: 20min (5 slowest eliminated), Q2: 15min (5 eliminated), Q3: 12min (top 10)',
      period: 3,
      group: 1,
      color: '#2563eb'
    },
    {
      id: 16,
      name: 'Points System',
      category: '경기규칙',
      description: '순위별 포인트 배점 시스템',
      details: '25-18-15-12-10-8-6-4-2-1 points for positions 1-10. Fastest lap = +1 point if in top 10',
      period: 3,
      group: 2,
      color: '#2563eb'
    },
    {
      id: 17,
      name: 'Sprint Race',
      category: '경기규칙',
      description: '토요일 짧은 경기 (약 100km)',
      details: 'Short format race on Saturday, points awarded to top 8 finishers',
      period: 3,
      group: 3,
      color: '#2563eb'
    },
    {
      id: 18,
      name: 'Parc Fermé',
      category: '경기규칙',
      description: '예선 후 차량 수정 금지',
      details: 'Cars cannot be modified between qualifying and race, sealed in parc fermé',
      period: 3,
      group: 13,
      color: '#2563eb'
    },

    // 안전 규칙 (네 번째 행)
    {
      id: 19,
      name: 'Yellow Flag',
      category: '안전',
      description: '위험 구간 주의, 추월 금지',
      details: 'Caution: Incident ahead, no overtaking allowed, reduce speed',
      period: 4,
      group: 1,
      color: '#f59e0b'
    },
    {
      id: 20,
      name: 'Safety Car',
      category: '안전',
      description: '안전차 출동시 추월 금지',
      details: 'Safety car deployed to control race pace during dangerous conditions',
      period: 4,
      group: 2,
      color: '#f59e0b'
    },
    {
      id: 21,
      name: 'Virtual SC',
      category: '안전',
      description: '가상 안전차로 속도 제한',
      details: 'Virtual Safety Car: Delta time system limits speed without physical safety car',
      period: 4,
      group: 3,
      color: '#f59e0b'
    },
    {
      id: 22,
      name: 'Halo',
      category: '안전',
      description: '드라이버 머리 보호 장치',
      details: 'Titanium head protection device, introduced in 2018 after controversy',
      period: 4,
      group: 13,
      color: '#f59e0b'
    },

    // 기술 규칙 (다섯 번째 행)
    {
      id: 23,
      name: 'Power Unit',
      category: '기술',
      description: '1.6L V6 터보 하이브리드',
      details: '1.6L V6 turbo + MGU-K + MGU-H, maximum 15,000 RPM',
      period: 5,
      group: 1,
      color: '#10b981'
    },
    {
      id: 24,
      name: 'Tire Compounds',
      category: '기술',
      description: '피렐리 타이어 컴파운드',
      details: 'C1-C5 compounds, 3 compounds per weekend (Hard, Medium, Soft)',
      period: 5,
      group: 2,
      color: '#10b981'
    },
    {
      id: 25,
      name: 'Weight Limit',
      category: '기술',
      description: '최소 중량 798kg',
      details: 'Minimum weight 798kg including driver (2025), ballast used to reach minimum',
      period: 5,
      group: 3,
      color: '#10b981'
    },
    {
      id: 26,
      name: 'Fuel Flow',
      category: '기술',
      description: '연료 흐름율 제한',
      details: 'Maximum 100kg/h fuel flow rate, monitored by FIA sensors',
      period: 5,
      group: 13,
      color: '#10b981'
    },

    // 트리비아 & 재미있는 사실 (여섯 번째 행)
    {
      id: 27,
      name: 'Watch Pose',
      category: '트리비아',
      description: '인터뷰 시 머리 만지는 이유',
      details: 'Drivers touch their head/cap to show sponsor watches clearly during interviews',
      period: 6,
      group: 1,
      color: '#8b5cf6'
    },
    {
      id: 28,
      name: 'Drink Button',
      category: '트리비아',
      description: '키미의 전설적인 무전',
      details: 'Kimi: "No, you will not have the drink!" - steering wheel drink system failure',
      period: 6,
      group: 2,
      color: '#8b5cf6'
    },
    {
      id: 29,
      name: 'Grid Walk',
      category: '트리비아',
      description: '마틴 브런들의 그리드 워크',
      details: 'Martin Brundle awkwardly interviewing celebrities who don\'t know F1',
      period: 6,
      group: 3,
      color: '#8b5cf6'
    },
    {
      id: 30,
      name: 'Pirelli Hat',
      category: '트리비아',
      description: '시상식 피렐리 모자 던지기',
      details: 'Winners often throw away Pirelli hats immediately after receiving them',
      period: 6,
      group: 13,
      color: '#8b5cf6'
    },
    {
      id: 31,
      name: 'Champagne Shower',
      category: '트리비아',
      description: '시상식 샴페인 세레모니',
      details: 'Podium tradition since 1967, sometimes replaced with local beverages',
      period: 6,
      group: 14,
      color: '#8b5cf6'
    },
    {
      id: 32,
      name: 'Formation Lap',
      category: '트리비아',
      description: '포메이션 랩의 숨겨진 이유',
      details: 'Not just warmup - drivers collect rubber marbles to add weight and check rivals',
      period: 6,
      group: 15,
      color: '#8b5cf6'
    },

    // 전략 & 심리전 (일곱 번째 행)
    {
      id: 33,
      name: 'Mind Games',
      category: '심리전',
      description: '드라이버간 심리전',
      details: 'Psychological warfare: Senna vs Prost, Hamilton vs Rosberg era tactics',
      period: 7,
      group: 1,
      color: '#ec4899'
    },
    {
      id: 34,
      name: 'Team Orders',
      category: '심리전',
      description: '팀 오더와 정치적 게임',
      details: 'Internal team politics, "Fernando is faster than you" - Ferrari 2010',
      period: 7,
      group: 2,
      color: '#ec4899'
    },
    {
      id: 35,
      name: 'Sandbagging',
      category: '심리전',
      description: '연습 세션에서 속력 숨기기',
      details: 'Teams deliberately hide pace in practice to mislead rivals about performance',
      period: 7,
      group: 3,
      color: '#ec4899'
    },
    {
      id: 36,
      name: 'Garage Secrets',
      category: '심리전',
      description: '가라지에서의 스파이 활동',
      details: 'Teams use screens, fake setup sheets, and decoy mechanics to hide secrets',
      period: 7,
      group: 13,
      color: '#ec4899'
    },
    {
      id: 37,
      name: 'Radio Theatre',
      category: '심리전',
      description: '가짜 무전으로 속임수',
      details: 'Teams broadcast fake radio messages knowing rivals listen to manipulate strategy',
      period: 7,
      group: 14,
      color: '#ec4899'
    },
    {
      id: 38,
      name: 'Luck Factor',
      category: '심리전',
      description: 'F1에서 운의 역할',
      details: 'Weather, safety cars, mechanical failures can completely change championship fights',
      period: 7,
      group: 15,
      color: '#ec4899'
    }
  ], [])

  const views = useMemo(() => [
    { name: 'TABLE', description: 'Periodic table layout' },
    { name: 'SPHERE', description: 'Spherical arrangement' },
    { name: 'HELIX', description: 'Helical structure' },
    { name: 'GRID', description: 'Grid formation' }
  ], [])

  const generateMatrixColumns = useCallback(() => {
    const columns = []
    const columnCount = 12

    for (let i = 0; i < columnCount; i++) {
      const characters = []
      const charCount = Math.floor(Math.random() * 25) + 20

      for (let j = 0; j < charCount; j++) {
        characters.push(matrixChars[Math.floor(Math.random() * matrixChars.length)])
      }

      columns.push({
        id: `col-${Date.now()}-${Math.random()}-${i}`,
        left: i * (100 / columnCount) + Math.random() * 3,
        characters,
        delay: i * 0.8,
        duration: 8 + Math.random() * 2
      })
    }

    setMatrixColumns(columns)
  }, [matrixChars])

  const initThreeJS = useCallback(async () => {
    const container = containerRef.current
    if (!container || initRef.current) return

    initRef.current = true

    // Load required modules
    try {
      const { CSS3DRenderer: Renderer, CSS3DObject: Object } = await import('three/examples/jsm/renderers/CSS3DRenderer.js')
      const TweenModule = await import('three/examples/jsm/libs/tween.module.js')

      CSS3DRenderer = Renderer
      CSS3DObject = Object
      TWEEN = TweenModule.default
    } catch (error) {
      console.error('Failed to load CSS3D dependencies:', error)
      return
    }

    // Scene setup
    sceneRef.current = new THREE.Scene()

    // Camera
    cameraRef.current = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 1, 10000)
    cameraRef.current.position.set(0, 0, 2500)

    // CSS3D Renderer
    rendererRef.current = new CSS3DRenderer()
    rendererRef.current.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(rendererRef.current.domElement)

    // Create objects
    createObjects()

    // Create target positions
    createTargets()

    // Start with TABLE view
    transformTo('TABLE')

    // Force initial camera position
    setTimeout(() => {
      cameraRef.current.position.set(0, 0, 2500)
      cameraRef.current.lookAt(sceneRef.current.position)
    }, 100)

    // Add controls
    addControls()

    // Start animation
    animate()

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !container) return

      cameraRef.current.aspect = container.clientWidth / container.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Add click listener for closing expanded rule
    const handleClick = (event) => {
      if (!event.target.closest('.rule-element') && expandedRuleRef.current) {
        closeExpandedRule()
      }
    }
    container.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('click', handleClick)
    }
  }, [])

  const createObjects = useCallback(() => {
    rules.forEach((rule, index) => {
      // Create DOM element
      const element = document.createElement('div')
      element.className = 'rule-element'
      element.innerHTML = `
        <div class="rule-number">${rule.id}</div>
        <div class="rule-name">${rule.name}</div>
        <div class="rule-category">${rule.category}</div>
      `

      // Create CSS3D object
      const object = new CSS3DObject(element)
      object.userData = { rule, index }
      object.element = element

      element.addEventListener('click', (event) => {
        event.stopPropagation()
        expandRule(rule, object)
      })

      sceneRef.current.add(object)
      objectsRef.current.push(object)
    })
  }, [rules])

  const createTargets = useCallback(() => {
    // TABLE layout (periodic table style)
    rules.forEach((rule, i) => {
      const object = new THREE.Object3D()
      object.position.x = (rule.group * 140) - 1330
      object.position.y = -(rule.period * 180) + 900
      object.position.z = 0
      targetsRef.current.table.push(object)
    })

    // SPHERE layout
    const vector = new THREE.Vector3()
    rules.forEach((rule, i) => {
      const phi = Math.acos(-1 + (2 * i) / rules.length)
      const theta = Math.sqrt(rules.length * Math.PI) * phi

      const object = new THREE.Object3D()
      object.position.setFromSphericalCoords(800, phi, theta)

      vector.copy(object.position).multiplyScalar(2)
      object.lookAt(vector)
      targetsRef.current.sphere.push(object)
    })

    // HELIX layout
    rules.forEach((rule, i) => {
      const theta = i * 0.175 + Math.PI
      const y = -(i * 8) + 450

      const object = new THREE.Object3D()
      object.position.setFromCylindricalCoords(900, theta, y)

      vector.x = object.position.x * 2
      vector.y = object.position.y
      vector.z = object.position.z * 2
      object.lookAt(vector)
      targetsRef.current.helix.push(object)
    })

    // GRID layout
    rules.forEach((rule, i) => {
      const object = new THREE.Object3D()
      object.position.x = ((i % 5) * 400) - 800
      object.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800
      object.position.z = (Math.floor(i / 25)) * 800 - 1600
      targetsRef.current.grid.push(object)
    })
  }, [rules])

  const transformTo = useCallback((viewName) => {
    // Close expanded rule when switching views
    if (expandedRuleRef.current) {
      closeExpandedRule()
    }

    setCurrentView(viewName)
    const target = targetsRef.current[viewName.toLowerCase()]

    // Smooth animation to new positions
    objectsRef.current.forEach((object, i) => {
      // Ensure scale is always reset first
      object.scale.set(1, 1, 1)

      // Animate to new positions smoothly
      new TWEEN.Tween(object.position)
        .to({
          x: target[i].position.x,
          y: target[i].position.y,
          z: target[i].position.z
        }, Math.random() * 300 + 600)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()

      new TWEEN.Tween(object.rotation)
        .to({
          x: target[i].rotation.x,
          y: target[i].rotation.y,
          z: target[i].rotation.z
        }, Math.random() * 300 + 600)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start()
    })
  }, [])

  const addControls = useCallback(() => {
    // Smooth 360 rotation controls with zoom
    let isMouseDown = false
    let targetRotationX = 0, targetRotationY = 0
    let rotationX = 0, rotationY = 0
    let targetRadius = 2500, currentRadius = 2500
    let isCtrlPressed = false

    const container = containerRef.current

    const handleMouseDown = (event) => {
      isMouseDown = true
      container.style.cursor = 'grabbing'
    }

    const handleMouseUp = () => {
      isMouseDown = false
      container.style.cursor = 'grab'
    }

    const handleMouseLeave = () => {
      isMouseDown = false
      container.style.cursor = 'grab'
    }

    const handleMouseMove = (event) => {
      if (isMouseDown) {
        // Once user starts dragging, permanently activate the interface
        setHasStartedDragging(true)

        const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
        const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

        // Smoother rotation with better sensitivity
        targetRotationY += deltaX * 0.008
        targetRotationX += deltaY * 0.008

        // Limit vertical rotation for better UX
        targetRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotationX))
      }
    }

    // Track Ctrl key state
    const handleKeyDown = (event) => {
      if (event.key === 'Control') {
        isCtrlPressed = true
      }
    }

    const handleKeyUp = (event) => {
      if (event.key === 'Control') {
        isCtrlPressed = false
      }
    }

    // Add mouse wheel zoom functionality (only with Ctrl key)
    const handleWheel = (event) => {
      if (event.ctrlKey || isCtrlPressed) {
        event.preventDefault()

        const zoomSpeed = 100
        const minRadius = 500
        const maxRadius = 5000

        if (event.deltaY > 0) {
          // Zoom out
          targetRadius = Math.min(targetRadius + zoomSpeed, maxRadius)
        } else {
          // Zoom in
          targetRadius = Math.max(targetRadius - zoomSpeed, minRadius)
        }
      }
    }

    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    container.style.cursor = 'grab'

    const render = () => {
      // Very smooth rotation and zoom interpolation
      rotationX += (targetRotationX - rotationX) * 0.08
      rotationY += (targetRotationY - rotationY) * 0.08
      currentRadius += (targetRadius - currentRadius) * 0.1

      // Always use orbital camera with dynamic zoom
      cameraRef.current.position.x = Math.cos(rotationY) * Math.cos(rotationX) * currentRadius
      cameraRef.current.position.y = Math.sin(rotationX) * currentRadius
      cameraRef.current.position.z = Math.sin(rotationY) * Math.cos(rotationX) * currentRadius

      cameraRef.current.lookAt(sceneRef.current.position)

      // Update expanded card position if exists
      if (expandedRuleRef.current) {
        const expandedObject = objectsRef.current.find(obj => obj.userData.rule === expandedRuleRef.current)
        if (expandedObject) {
          const cameraDirection = new THREE.Vector3()
          cameraRef.current.getWorldDirection(cameraDirection)

          const distanceFromCamera = 1000
          const newTargetPosition = new THREE.Vector3()
          newTargetPosition.copy(cameraRef.current.position).add(cameraDirection.multiplyScalar(distanceFromCamera))

          // Offset upward to avoid UI panel overlap
          newTargetPosition.y += 100

          // Smoothly update expanded card position
          expandedObject.position.lerp(newTargetPosition, 0.1)

          // Make card always face camera
          const lookAtQuaternion = new THREE.Quaternion()
          const tempMatrix = new THREE.Matrix4()
          tempMatrix.lookAt(expandedObject.position, cameraRef.current.position, cameraRef.current.up)
          lookAtQuaternion.setFromRotationMatrix(tempMatrix)

          // Add 180 degree flip to show back side
          const flipQuaternion = new THREE.Quaternion()
          flipQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
          lookAtQuaternion.multiply(flipQuaternion)

          expandedObject.quaternion.slerp(lookAtQuaternion, 0.1)
        }
      }
    }

    sceneRef.current.userData.render = render

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const animate = useCallback(() => {
    const animateLoop = () => {
      animationIdRef.current = requestAnimationFrame(animateLoop)
      if (TWEEN) {
        TWEEN.update()
      }

      if (sceneRef.current && sceneRef.current.userData.render) {
        sceneRef.current.userData.render()
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animateLoop()
  }, [])

  const expandRule = useCallback((rule, object) => {
    if (expandedRule === rule) return

    // Close any currently expanded rule first
    if (expandedRule) {
      closeExpandedRule()
    }

    setExpandedRule(rule)
    expandedRuleRef.current = rule
    setSelectedRule(rule)

    // Store original position, rotation, and scale
    originalPositionRef.current = {
      x: object.position.x,
      y: object.position.y,
      z: object.position.z
    }
    originalRotationRef.current = {
      x: object.rotation.x,
      y: object.rotation.y,
      z: object.rotation.z
    }

    // Create detailed content for the back side
    const detailElement = document.createElement('div')
    detailElement.className = 'rule-element-detail'
    detailElement.innerHTML = `
      <div class="detail-header">
        <div class="detail-number">#${rule.id}</div>
        <div class="detail-category">${rule.category}</div>
      </div>
      <div class="detail-name">${rule.name}</div>
      <div class="detail-description">${rule.description}</div>
      <div class="detail-info">${rule.details}</div>
    `

    // Replace the element content after flip animation starts
    setTimeout(() => {
      object.element.innerHTML = detailElement.innerHTML
      object.element.className = 'rule-element-detail'

      // Add click event to close when clicked
      object.element.addEventListener('click', (event) => {
        event.stopPropagation()
        closeExpandedRule()
      })
    }, 400)

    // Calculate position in front of camera regardless of camera angle
    const cameraDirection = new THREE.Vector3()
    cameraRef.current.getWorldDirection(cameraDirection)

    const distanceFromCamera = 1000
    const targetPosition = new THREE.Vector3()
    targetPosition.copy(cameraRef.current.position).add(cameraDirection.multiplyScalar(distanceFromCamera))

    // Offset upward to avoid UI panel overlap
    targetPosition.y += 100

    // Animate to position in front of camera with flip and larger scale
    new TWEEN.Tween(object.position)
      .to({
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z
      }, 800)
      .easing(TWEEN.Easing.Back.Out)
      .start()

    // Make card face the camera
    const lookAtQuaternion = new THREE.Quaternion()
    const tempMatrix = new THREE.Matrix4()
    tempMatrix.lookAt(targetPosition, cameraRef.current.position, cameraRef.current.up)
    lookAtQuaternion.setFromRotationMatrix(tempMatrix)

    // Add 180 degree flip to show back side
    const flipQuaternion = new THREE.Quaternion()
    flipQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
    lookAtQuaternion.multiply(flipQuaternion)

    const targetEuler = new THREE.Euler()
    targetEuler.setFromQuaternion(lookAtQuaternion)

    new TWEEN.Tween(object.rotation)
      .to({
        x: targetEuler.x,
        y: targetEuler.y,
        z: targetEuler.z
      }, 800)
      .easing(TWEEN.Easing.Back.Out)
      .start()

    new TWEEN.Tween(object.scale)
      .to({ x: 1.8, y: 1.8, z: 1.8 }, 800)
      .easing(TWEEN.Easing.Back.Out)
      .start()
  }, [])

  const closeExpandedRule = useCallback(() => {
    if (!expandedRule) return

    const expandedObject = objectsRef.current.find(obj => obj.userData.rule === expandedRule)
    if (!expandedObject) return

    const rule = expandedRule

    // Clear current state first
    setExpandedRule(null)
    expandedRuleRef.current = null
    setSelectedRule(null)

    // Restore original content after half flip
    setTimeout(() => {
      expandedObject.element.innerHTML = `
        <div class="rule-number">${rule.id}</div>
        <div class="rule-name">${rule.name}</div>
        <div class="rule-category">${rule.category}</div>
      `
      expandedObject.element.className = 'rule-element'

      // Re-add original click event
      expandedObject.element.addEventListener('click', (event) => {
        event.stopPropagation()
        expandRule(rule, expandedObject)
      })
    }, 300)

    // Animate back to original position with flip back
    new TWEEN.Tween(expandedObject.position)
      .to(originalPositionRef.current, 600)
      .easing(TWEEN.Easing.Back.In)
      .start()

    new TWEEN.Tween(expandedObject.rotation)
      .to(originalRotationRef.current, 600)
      .easing(TWEEN.Easing.Back.In)
      .start()

    new TWEEN.Tween(expandedObject.scale)
      .to({ x: 1, y: 1, z: 1 }, 600)
      .easing(TWEEN.Easing.Back.In)
      .start()

    originalPositionRef.current = null
    originalRotationRef.current = null
  }, [expandedRule, expandRule])

  useEffect(() => {
    // Pre-generate matrix effect immediately
    generateMatrixColumns()

    // Pre-warm the matrix animations
    setTimeout(() => {
      const matrixBg = document.querySelector('.matrix-background')
      if (matrixBg) {
        matrixBg.style.opacity = '0.01'
        setTimeout(() => {
          matrixBg.style.opacity = '0'
        }, 10)
      }
    }, 100)

    // Matrix character changing
    const charChangeInterval = setInterval(() => {
      setMatrixColumns(prevColumns => {
        if (prevColumns.length === 0) return prevColumns

        const columnsToUpdate = Math.floor(prevColumns.length / 3)
        const newColumns = [...prevColumns]

        for (let i = 0; i < columnsToUpdate; i++) {
          const randomColumnIndex = Math.floor(Math.random() * newColumns.length)
          const column = newColumns[randomColumnIndex]

          const charsToUpdate = Math.floor(column.characters.length / 4)
          for (let j = 0; j < charsToUpdate; j++) {
            const randomCharIndex = Math.floor(Math.random() * column.characters.length)
            column.characters[randomCharIndex] = matrixChars[Math.floor(Math.random() * matrixChars.length)]
          }
        }
        return newColumns
      })
    }, 300)

    // Less frequent column regeneration
    const columnRegenInterval = setInterval(() => {
      setMatrixColumns(prevColumns => {
        if (prevColumns.length === 0) return prevColumns

        const columnsToUpdate = Math.floor(Math.random() * 4) + 2
        const newColumns = [...prevColumns]

        for (let i = 0; i < columnsToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * newColumns.length)
          const characters = []
          const charCount = Math.floor(Math.random() * 30) + 20

          for (let j = 0; j < charCount; j++) {
            characters.push(matrixChars[Math.floor(Math.random() * matrixChars.length)])
          }

          newColumns[randomIndex] = {
            ...newColumns[randomIndex],
            characters: characters,
            delay: Math.random() * 5,
            duration: Math.random() * 4 + 8
          }
        }
        return newColumns
      })
    }, 4000)

    initThreeJS()

    return () => {
      clearInterval(charChangeInterval)
      clearInterval(columnRegenInterval)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove()
      }
    }
  }, [initThreeJS, matrixChars])

  return (
    <div className="rules-periodic-system">
      {/* Matrix Background Effect */}
      <div className={`matrix-background ${hasStartedDragging ? 'visible' : ''}`}>
        {matrixColumns.map((column, columnIndex) => (
          <div
            key={column.id || `column-${columnIndex}`}
            className="matrix-column"
            style={{
              left: column.left + '%',
              animationDelay: column.delay + 's',
              animationDuration: column.duration + 's'
            }}
          >
            {column.characters.map((char, index) => (
              <div
                key={`${column.id || columnIndex}-${index}`}
                className="matrix-char"
                style={{
                  animationDelay: (index * 0.1 + column.delay) + 's'
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* DRAG Text Indicator (Intro) */}
      <div className={`move-indicator ${hasStartedDragging ? 'hidden' : ''}`}>
        <div className="move-text">DRAG</div>
      </div>

      {/* 3D Container */}
      <div ref={containerRef} className="rules-container"></div>

      {/* Controls */}
      <div className="controls-panel">
        <div className="section-title">F1 RULES</div>
        <div className="view-controls">
          {views.map((view) => (
            <button
              key={view.name}
              onClick={() => transformTo(view.name)}
              className={`view-btn ${currentView === view.name ? 'active' : ''}`}
            >
              {view.name}
            </button>
          ))}
        </div>
        <div className="info-panel">
          <div className="rule-count">{rules.length} Rules</div>
          {selectedRule && (
            <div className="selected-info">
              <h3>{selectedRule.name}</h3>
              <p>{selectedRule.description}</p>
              {expandedRule && (
                <div className="rule-details">
                  <p className="details-text">{selectedRule.details}</p>
                  <div className="rule-meta">
                    <span className="rule-id">#{selectedRule.id}</span>
                    <span className="rule-category-badge">{selectedRule.category}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .rules-periodic-system {
          width: 100%;
          height: 150vh;
          position: relative;
          background: linear-gradient(135deg, #000000, #0a0a0a, #111111);
          overflow: hidden;
        }

        .matrix-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          transform: translateZ(0);
          will-change: opacity;
        }

        .matrix-background.visible {
          opacity: 1 !important;
        }

        .matrix-column {
          position: absolute;
          top: 110vh;
          width: 20px;
          height: 120vh;
          animation: matrixRise infinite linear;
          opacity: 0.8;
          transform: translateZ(0);
          will-change: transform;
        }

        .matrix-char {
          display: block;
          color: #888888;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: bold;
          line-height: 18px;
          text-shadow: 0 0 8px rgba(200, 200, 200, 0.4);
          animation: matrixGlow 2s infinite alternate;
          margin-bottom: 2px;
          transform: translateZ(0);
          will-change: opacity, color;
        }

        @keyframes matrixRise {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-230vh);
          }
        }

        @keyframes matrixGlow {
          0% {
            opacity: 0.2;
            color: #666666;
            text-shadow: 0 0 5px rgba(150, 150, 150, 0.2);
          }
          50% {
            opacity: 0.8;
            color: #bbbbbb;
            text-shadow: 0 0 12px rgba(200, 200, 200, 0.6), 0 0 25px rgba(220, 220, 220, 0.3);
          }
          100% {
            opacity: 0.2;
            color: #666666;
            text-shadow: 0 0 5px rgba(150, 150, 150, 0.2);
          }
        }

        .controls-panel {
          position: absolute;
          bottom: 200px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          color: white;
          background: rgba(20, 20, 20, 0.9);
          padding: 20px 32px;
          border-radius: 16px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(150, 150, 150, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          min-width: 500px;
        }

        .section-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
          text-align: center;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .view-controls {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 1.5rem;
        }

        .view-btn {
          background: linear-gradient(135deg,
            rgba(60, 60, 60, 0.6) 0%,
            rgba(80, 80, 80, 0.7) 100%);
          border: 1px solid rgba(150, 150, 150, 0.3);
          color: rgba(220, 220, 220, 0.95);
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          min-width: 80px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(15px);
          box-shadow:
            0 4px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .view-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transition: left 0.7s ease;
        }

        .view-btn:hover::before {
          left: 100%;
        }

        .view-btn:hover {
          border-color: rgba(200, 200, 200, 0.5);
          color: white;
          transform: translateY(-2px) scale(1.03);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 0 20px rgba(200, 200, 200, 0.3);
          background: linear-gradient(135deg,
            rgba(80, 80, 80, 0.7) 0%,
            rgba(100, 100, 100, 0.8) 100%);
        }

        .view-btn.active {
          background: linear-gradient(135deg,
            rgba(120, 120, 120, 0.8) 0%,
            rgba(150, 150, 150, 0.9) 100%);
          border-color: rgba(200, 200, 200, 0.6);
          color: white;
          font-weight: 700;
          transform: scale(1.06);
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.5),
            inset 0 2px 0 rgba(255, 255, 255, 0.2),
            0 0 25px rgba(200, 200, 200, 0.5);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }

        .info-panel {
          border-top: 1px solid rgba(150, 150, 150, 0.3);
          padding-top: 1.5rem;
          text-align: center;
        }

        .rule-count {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1rem;
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .selected-info {
          min-height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .selected-info h3 {
          font-size: 1.2rem;
          color: #00d4ff;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .selected-info p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          max-width: 350px;
          margin: 0 auto;
        }

        .rule-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(150, 150, 150, 0.3);
        }

        .details-text {
          font-size: 0.85rem !important;
          color: rgba(255, 255, 255, 0.9) !important;
          line-height: 1.6 !important;
          margin-bottom: 1rem !important;
          font-style: italic;
        }

        .rule-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }

        .rule-id {
          font-size: 0.75rem;
          color: rgba(0, 212, 255, 0.8);
          font-weight: 600;
          background: rgba(0, 212, 255, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .rule-category-badge {
          font-size: 0.7rem;
          color: white;
          font-weight: 600;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 255, 255, 0.2));
          padding: 4px 12px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(0, 212, 255, 0.4);
        }

        .rules-container {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 100;
        }

        /* DRAG Text Indicator */
        .move-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 150;
          pointer-events: none;
          transition: opacity 0.8s ease;
          opacity: 1;
        }

        .move-indicator.hidden {
          opacity: 0;
        }

        .move-text {
          font-size: 2.5rem;
          font-weight: 300;
          color: rgba(150, 150, 150, 0.6);
          text-shadow: 0 0 20px rgba(150, 150, 150, 0.3);
          letter-spacing: 0.5em;
          font-family: 'SF Pro Display', -apple-system, system-ui, sans-serif;
          animation: dragGlow 3s infinite ease-in-out;
        }

        @keyframes dragGlow {
          0%, 100% {
            color: rgba(150, 150, 150, 0.6);
            text-shadow: 0 0 20px rgba(150, 150, 150, 0.3);
          }
          50% {
            color: rgba(180, 180, 180, 0.8);
            text-shadow: 0 0 30px rgba(180, 180, 180, 0.5);
          }
        }

        /* Rule Element Styles - Subtle Gray Design */
        :global(.rule-element) {
          width: 120px;
          height: 120px;
          opacity: 0.9;
          border: 1px solid rgba(150, 150, 150, 0.2);
          border-radius: 12px;
          padding: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background: rgba(60, 60, 60, 0.7);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          font-family: 'SF Pro Display', -apple-system, system-ui, sans-serif;
          position: relative;
        }

        :global(.rule-element:hover) {
          opacity: 1;
          transform: scale(1.08) translateY(-8px);
          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 0 30px rgba(200, 200, 200, 0.4),
            0 0 0 2px rgba(200, 200, 200, 0.3);
          border-color: rgba(200, 200, 200, 0.7);
          background: rgba(90, 90, 90, 0.9);
          z-index: 1000;
          animation: cardGlow 1.5s infinite alternate;
        }

        @keyframes cardGlow {
          0% {
            box-shadow:
              0 15px 40px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 30px rgba(200, 200, 200, 0.4),
              0 0 0 2px rgba(200, 200, 200, 0.3);
          }
          100% {
            box-shadow:
              0 15px 40px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 35px rgba(255, 255, 255, 0.5),
              0 0 0 2px rgba(255, 255, 255, 0.5);
          }
        }

        :global(.rule-number) {
          font-size: 0.8rem;
          font-weight: 600;
          opacity: 0.7;
          color: rgba(200, 200, 200, 0.8);
          margin-bottom: 4px;
          text-shadow: 0 0 8px rgba(200, 200, 200, 0.3);
        }

        :global(.rule-name) {
          font-size: 0.95rem;
          font-weight: 800;
          line-height: 1.2;
          color: white;
          margin-bottom: 8px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
          position: relative;
          z-index: 1;
        }

        :global(.rule-category) {
          font-size: 0.7rem;
          text-transform: uppercase;
          opacity: 0.8;
          letter-spacing: 0.5px;
          color: rgba(180, 180, 180, 0.9);
          font-weight: 500;
          background: rgba(100, 100, 100, 0.3);
          padding: 2px 8px;
          border-radius: 8px;
          backdrop-filter: blur(5px);
        }

        /* Detailed card back styles */
        :global(.rule-element-detail) {
          width: 120px;
          height: 120px;
          opacity: 1;
          border: 1px solid rgba(200, 200, 200, 0.4);
          border-radius: 12px;
          padding: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          text-align: center;
          background: rgba(30, 30, 30, 0.95);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 30px rgba(200, 200, 200, 0.4);
          backdrop-filter: blur(15px);
          font-family: 'SF Pro Display', -apple-system, system-ui, sans-serif;
          position: relative;
          transform: rotateY(180deg);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        :global(.detail-header) {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 8px;
          font-size: 0.65rem;
        }

        :global(.detail-number) {
          color: rgba(200, 200, 200, 0.7);
          font-weight: 600;
        }

        :global(.detail-category) {
          color: rgba(180, 180, 180, 0.8);
          text-transform: uppercase;
          background: rgba(100, 100, 100, 0.3);
          padding: 1px 6px;
          border-radius: 6px;
          font-size: 0.6rem;
        }

        :global(.detail-name) {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
          line-height: 1.1;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          -webkit-font-smoothing: antialiased;
        }

        :global(.detail-description) {
          font-size: 0.7rem;
          margin-bottom: 6px;
          color: rgba(240, 240, 240, 0.95);
          line-height: 1.2;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          -webkit-font-smoothing: antialiased;
        }

        :global(.detail-info) {
          font-size: 0.65rem;
          color: rgba(220, 220, 220, 0.9);
          line-height: 1.3;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          font-style: italic;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  )
}

export default Rules
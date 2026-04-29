import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface Vertex {
  x: number
  y: number
}

export function usePolygonArena(
  engine: Matter.Engine | null,
  sides: number,
  width: number,
  height: number,
  vertexValues: number[]
) {
  const outerVertsRef = useRef<Vertex[]>([])
  const innerVertsRef = useRef<Vertex[]>([])

  useEffect(() => {
    if (!engine) return

    const { Bodies, Composite } = Matter
    const cx = width / 2
    const cy = height / 2
    const radius = Math.min(width, height) * 0.42

    const old = Composite.allBodies(engine.world).filter(
      (b) => b.isStatic && b.label === 'wall'
    )
    Composite.remove(engine.world, old)

    const outerVerts: Vertex[] = []
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2
      outerVerts.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) })
    }
    outerVertsRef.current = outerVerts

    const innerVerts: Vertex[] = outerVerts.map((v, i) => {
      const t = (vertexValues[i] ?? 10) / 10
      return {
        x: cx + (v.x - cx) * t,
        y: cy + (v.y - cy) * t,
      }
    })
    innerVertsRef.current = innerVerts

    const walls: Matter.Body[] = []
    for (let i = 0; i < sides; i++) {
      const v1 = innerVerts[i]
      const v2 = innerVerts[(i + 1) % sides]

      const mx = (v1.x + v2.x) / 2
      const my = (v1.y + v2.y) / 2
      const len = Math.hypot(v2.x - v1.x, v2.y - v1.y)
      const angle = Math.atan2(v2.y - v1.y, v2.x - v1.x)

      if (len < 1) return

      walls.push(
        Bodies.rectangle(mx, my, len, 8, {
          isStatic: true,
          angle,
          restitution: 1,
          friction: 0,
          frictionStatic: 0,
          slop: 0,
          label: 'wall',
        })
      )
    }

    Composite.add(engine.world, walls)
  }, [engine, sides, width, height, vertexValues])

  return { outerVertsRef, innerVertsRef }
}
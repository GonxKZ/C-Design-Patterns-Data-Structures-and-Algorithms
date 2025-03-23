const microservicesPattern = {
  id: 'microservices',
  name: 'Microservices',
  category: 'architectural',
  description: 'Estructura una aplicación como un conjunto de servicios pequeños, autónomos y débilmente acoplados, cada uno ejecutándose en su propio proceso y comunicándose mediante mecanismos ligeros.',
  theory: {
    background: 'El patrón de Microservicios surgió como una evolución del diseño orientado a servicios (SOA) y ganó popularidad a principios de la década de 2010. Empresas como Netflix, Amazon y Spotify fueron pioneras en su adopción a gran escala. Martin Fowler y James Lewis formalizaron el patrón en 2014.',
    problem: 'Las aplicaciones monolíticas tradicionales presentan varios desafíos: 1) Escalabilidad limitada, ya que todo el sistema debe escalar como una unidad, 2) Dificultad para adoptar nuevas tecnologías, 3) Ciclos de desarrollo y despliegue largos, 4) Complejidad creciente que dificulta entender y mantener la aplicación a medida que crece.',
    solution: 'Descomponer la aplicación en servicios pequeños, independientes y con responsabilidades bien definidas. Cada servicio: a) Implementa una capacidad de negocio específica, b) Puede ser desarrollado, desplegado y escalado de forma independiente, c) Tiene su propia base de datos o almacenamiento, d) Se comunica con otros servicios a través de API bien definidas o mensajería asíncrona.',
    applicability: [
      'Aplicaciones complejas que necesitan escalar diferentes componentes de forma independiente',
      'Sistemas que requieren actualizaciones frecuentes y ciclos de despliegue rápidos',
      'Cuando se necesita flexibilidad para utilizar diferentes tecnologías en distintas partes del sistema',
      'Equipos de desarrollo grandes que necesitan trabajar en paralelo con mínimas dependencias',
      'Aplicaciones que requieren alta disponibilidad y resiliencia'
    ],
    consequences: [
      'Mayor agilidad en el desarrollo y despliegue',
      'Escalabilidad granular y eficiente',
      'Aislamiento de fallos que mejora la resiliencia del sistema',
      'Libertad tecnológica para elegir la mejor herramienta para cada servicio',
      'Complejidad distribuida que introduce desafíos de operación, monitorización y debugging',
      'Necesidad de manejar la consistencia de datos entre servicios',
      'Overhead de comunicación en red y posible latencia aumentada'
    ]
  },
  notes: 'La implementación efectiva de microservicios requiere generalmente una cultura DevOps madura y automatización robusta. Patrones complementarios como API Gateway, Service Discovery, Circuit Breaker y Saga son fundamentales para construir arquitecturas de microservicios resilientes. Aunque los microservicios ofrecen grandes beneficios, no son apropiados para todos los sistemas, especialmente para aplicaciones más pequeñas donde la complejidad añadida puede superar sus ventajas. En la práctica, muchas organizaciones comienzan con un monolito bien diseñado y migran gradualmente a microservicios a medida que la complejidad aumenta.'
};

export default microservicesPattern; 
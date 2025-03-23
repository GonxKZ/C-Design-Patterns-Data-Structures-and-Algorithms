const bulkheadPattern = {
  id: 'bulkhead',
  name: 'Bulkhead',
  category: 'resilience',
  description: 'Aísla elementos del sistema en grupos para que si uno falla, los otros puedan continuar funcionando.',
  theory: {
    background: 'El patrón Bulkhead toma su nombre de las divisiones estancas de los barcos que previenen que un compartimento inundado cause el hundimiento de todo el navío. Fue popularizado por Michael Nygard en "Release It!" y es ampliamente utilizado en arquitecturas de microservicios.',
    problem: 'En sistemas con múltiples servicios o componentes, el fallo de uno puede consumir todos los recursos compartidos (como hilos, conexiones o memoria), provocando un fallo completo del sistema. Por ejemplo, un servicio lento podría agotar todos los hilos de conexión disponibles.',
    solution: 'Particionar los recursos del sistema en grupos aislados asignados a diferentes servicios o tipos de trabajo. Si un servicio falla y agota sus recursos asignados, solo ese servicio se ve afectado, mientras que el resto del sistema sigue funcionando con normalidad.',
    applicability: [
      'Sistemas con múltiples servicios o componentes que comparten recursos',
      'Aplicaciones que necesitan mantener alta disponibilidad incluso cuando partes del sistema fallan',
      'Microservicios donde el fallo de un servicio no debe afectar a otros',
      'Situaciones con dependencias externas de fiabilidad variable',
      'Para aislar operaciones críticas de aquellas menos importantes'
    ],
    consequences: [
      'Mayor aislamiento de fallos, evitando que se propaguen por todo el sistema',
      'Mejor utilización de recursos al limitar el consumo de cada componente',
      'Degradación gradual ante fallos en lugar de fallos catastróficos',
      'Mayor complejidad en la configuración y gestión de recursos',
      'Posible infrautilización de recursos si las particiones están mal dimensionadas'
    ]
  },
  notes: 'Existen dos tipos principales de implementación del patrón Bulkhead: basado en semáforos (limitando el número de llamadas concurrentes) y basado en aislamiento de hilos (asignando diferentes grupos de hilos a diferentes servicios). Bibliotecas como Hystrix, Resilience4j e Istio ofrecen implementaciones de este patrón. El Bulkhead suele combinarse con otros patrones de resiliencia como Circuit Breaker y Timeout para crear sistemas altamente resistentes a fallos.'
};

export default bulkheadPattern; 
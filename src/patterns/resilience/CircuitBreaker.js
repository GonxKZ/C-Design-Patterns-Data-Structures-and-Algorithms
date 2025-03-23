const circuitBreakerPattern = {
  id: 'circuit-breaker',
  name: 'Circuit Breaker',
  category: 'resilience',
  description: 'Previene que un fallo en un servicio se propague a otros componentes, deteniendo las llamadas a un servicio fallido hasta que se recupere.',
  theory: {
    background: 'El patrón Circuit Breaker fue popularizado por Michael Nygard en su libro "Release It!" y se ha convertido en un componente fundamental en arquitecturas de microservicios. El nombre proviene de los interruptores eléctricos que cortan la corriente para prevenir daños mayores.',
    problem: 'En sistemas distribuidos, las llamadas a servicios remotos pueden fallar o tener tiempos de respuesta excesivamente largos debido a problemas de red, sobrecarga o fallos del servicio. Continuar intentando estas llamadas puede agotar recursos y causar fallos en cascada en todo el sistema.',
    solution: 'Implementar un "interruptor" que monitorea las fallas en las llamadas a servicios. Cuando se detecta un número predefinido de fallos, el circuito se "abre" y las llamadas posteriores fallan inmediatamente sin intentar la operación real. Después de un período de tiempo, el circuito cambia a estado "semi-abierto" y prueba si el servicio se ha recuperado. Si la prueba tiene éxito, el circuito se "cierra" y se reanuda la operación normal.',
    applicability: [
      'Sistemas distribuidos donde los componentes se comunican a través de la red',
      'Aplicaciones que dependen de servicios externos o microservicios',
      'Situaciones donde es necesario manejar fallos parciales de forma elegante',
      'Cuando se requiere degradación gradual de funcionalidad ante fallos',
      'Para implementar políticas de reintentos inteligentes y tiempos de espera'
    ],
    consequences: [
      'Mayor resiliencia del sistema ante fallos parciales',
      'Fallos rápidos cuando se sabe que un servicio no está disponible',
      'Recuperación automática cuando los servicios vuelven a funcionar',
      'Reducción de la latencia causada por tiempos de espera de servicios no disponibles',
      'Prevención de fallos en cascada y sobrecarga de recursos del sistema'
    ]
  },
  notes: 'El Circuit Breaker es un patrón esencial en arquitecturas distribuidas modernas y suele implementarse junto con otros patrones de resiliencia como Retry, Timeout y Bulkhead. Librerías como Hystrix (Java), Polly (.NET), Resilience4j y opossum (Node.js) proporcionan implementaciones robustas de este patrón. En versiones avanzadas, el Circuit Breaker puede incluir telemetría, notificaciones y paneles de control para monitorizar el estado del sistema en tiempo real.'
};

export default circuitBreakerPattern; 
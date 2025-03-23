const sagaPattern = {
  id: 'saga',
  name: 'Saga',
  category: 'resilience',
  description: 'Gestiona transacciones distribuidas en sistemas con múltiples servicios, coordinando una secuencia de acciones locales con compensaciones para mantener la consistencia.',
  theory: {
    background: 'El patrón Saga fue introducido por Hector Garcia-Molina y Kenneth Salem en 1987 como una solución para gestionar transacciones de larga duración. Ha ganado relevancia en arquitecturas de microservicios como alternativa a las transacciones distribuidas tradicionales.',
    problem: 'En sistemas distribuidos, mantener la consistencia de datos a través de múltiples servicios es un desafío. Las transacciones ACID tradicionales no son viables porque bloquearían recursos por períodos prolongados y crearían acoplamiento fuerte entre servicios.',
    solution: 'Implementar una secuencia de transacciones locales donde cada paso publica un evento que desencadena el siguiente paso. Si una transacción falla, se ejecutan transacciones compensatorias para los pasos ya completados, deshaciendo sus efectos y manteniendo la consistencia.',
    applicability: [
      'Arquitecturas de microservicios donde las operaciones cruzan múltiples servicios',
      'Procesos de negocio que requieren orquestación de múltiples pasos',
      'Cuando no es posible o deseable utilizar transacciones distribuidas tradicionales',
      'Operaciones de larga duración que no pueden mantener recursos bloqueados',
      'Sistemas que requieren alta disponibilidad y respuesta eventual'
    ],
    consequences: [
      'Permite mantener consistencia de datos en sistemas distribuidos',
      'Evita bloqueos prolongados de recursos',
      'Mayor resiliencia ante fallos parciales',
      'Aumenta la complejidad al requerir acciones compensatorias',
      'Implementa consistencia eventual en lugar de consistencia inmediata',
      'Requiere un diseño cuidadoso de la lógica de compensación'
    ]
  },
  notes: 'Existen dos principales implementaciones del patrón Saga: Coreografía, donde cada servicio emite eventos que otros servicios escuchan para ejecutar sus acciones; y Orquestación, donde un coordinador central dirige los pasos de la saga. Herramientas como Axon Framework, Eventuate Tram, y NServiceBus facilitan la implementación de sagas. Este patrón se complementa bien con Event Sourcing y CQRS, especialmente en sistemas distribuidos complejos.'
};

export default sagaPattern; 
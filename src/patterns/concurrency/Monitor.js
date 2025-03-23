const monitorPattern = {
  id: 'monitor',
  name: 'Monitor',
  category: 'concurrency',
  description: 'Encapsula datos compartidos y los procedimientos que operan sobre ellos en un módulo protegido, garantizando que solo un hilo puede ejecutar cualquiera de estos procedimientos a la vez.',
  theory: {
    background: 'El patrón Monitor fue propuesto por Tony Hoare en 1974 como un mecanismo de sincronización de alto nivel. Es una abstracción que combina mutexes y variables de condición en una construcción sencilla y potente, facilitando la escritura de código concurrente correcto. Lenguajes como Java implementan el concepto a través de sus bloques synchronized, mientras C++ requiere implementación manual usando mutexes y variables de condición.',
    problem: 'La programación concurrente requiere coordinación cuidadosa del acceso a datos compartidos entre hilos. El uso directo de primitivas de bajo nivel como mutexes y semáforos es propenso a errores, como deadlocks, condiciones de carrera y violaciones de invariantes de datos.',
    solution: 'Un monitor agrupa: 1) Datos internos privados (variables compartidas), 2) Procedimientos/métodos para acceder a estos datos, 3) Sincronización que garantiza que solo un hilo puede ejecutar un método del monitor a la vez, 4) Variables de condición para que los hilos esperen cuando no se cumplen ciertas condiciones, permitiendo que otros hilos progresen.',
    applicability: [
      'Sistemas multi-hilo donde varios hilos necesitan acceder y modificar datos compartidos',
      'Cuando se requiere encapsular la sincronización dentro de objetos que manejan recursos compartidos',
      'Para implementar abstracciones de sincronización de más alto nivel como colas de mensajes, buffers limitados o pools de recursos',
      'En la implementación de estructuras de datos thread-safe',
      'Para la coordinación entre productores y consumidores en un patrón productor-consumidor'
    ],
    consequences: [
      'Simplifica el razonamiento sobre código concurrente al encapsular la sincronización',
      'Reduce la probabilidad de errores de sincronización al centralizar el control de acceso',
      'Facilita el mantenimiento de invariantes de datos ya que los estados intermedios no son visibles',
      'Puede limitar el paralelismo al serializar todas las operaciones sobre el monitor',
      'Riesgo de deadlock si un método del monitor llama a otro monitor (problema de inversión de prioridad)',
      'Sobrecarga de rendimiento debido a la adquisición/liberación de bloqueos en cada llamada'
    ]
  }
};

export default monitorPattern; 
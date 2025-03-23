const readWriteLockPattern = {
  id: 'read-write-lock',
  name: 'Read-Write Lock',
  category: 'concurrency',
  description: 'Permite el acceso concurrente a un recurso compartido, permitiendo múltiples operaciones de lectura simultáneas, pero garantizando exclusividad para las operaciones de escritura.',
  theory: {
    background: 'El patrón Read-Write Lock surge de la necesidad de optimizar el rendimiento en escenarios donde las operaciones de lectura son mucho más frecuentes que las de escritura. A diferencia de un mutex simple que bloquea un recurso para cualquier tipo de acceso, un Read-Write Lock distingue entre operaciones de lectura (que no modifican el estado) y operaciones de escritura (que sí lo modifican), permitiendo que múltiples lectores accedan simultáneamente mientras garantiza exclusividad para los escritores.',
    problem: 'En sistemas concurrentes, cuando múltiples hilos acceden a datos compartidos, necesitamos sincronización para evitar condiciones de carrera. Sin embargo, un bloqueo simple puede ser demasiado restrictivo cuando muchas operaciones solo leen datos sin modificarlos.',
    solution: 'Implementar dos tipos de bloqueos: 1) Bloqueo de lectura: Permite que múltiples hilos accedan simultáneamente para leer, pero bloquea a los escritores. 2) Bloqueo de escritura: Proporciona acceso exclusivo para escritores, bloqueando tanto a otros escritores como a todos los lectores.',
    applicability: [
      'Escenarios donde las operaciones de lectura son significativamente más frecuentes que las de escritura',
      'Sistemas de caché donde múltiples hilos pueden leer datos en caché simultáneamente',
      'Bases de datos que necesitan alto rendimiento en operaciones de lectura',
      'Estructuras de datos compartidas donde la mayoría de las operaciones son consultas (lecturas)',
      'Aplicaciones con datos compartidos que cambian con poca frecuencia pero se consultan constantemente'
    ],
    consequences: [
      'Mayor rendimiento para operaciones de lectura al permitir acceso concurrente',
      'Prevención de condiciones de carrera para operaciones de escritura',
      'Riesgo de inanición (starvation) de escritores si las operaciones de lectura son continuas',
      'Mayor complejidad en la implementación comparado con un mutex simple',
      'Sobrecarga adicional en la gestión de los dos tipos de bloqueos',
      'Posibles deadlocks si no se implementa correctamente'
    ]
  }
};

export default readWriteLockPattern; 
const semaphorePattern = {
  id: 'semaphore',
  name: 'Semaphore',
  category: 'concurrency',
  description: 'Controla el acceso a recursos compartidos limitando el número de hilos que pueden acceder simultáneamente mediante un contador interno y operaciones atómicas de incremento y decremento.',
  theory: {
    background: 'El semáforo fue inventado por Edsger Dijkstra en 1965 como una primitiva de sincronización para sistemas operativos. Conceptualmente, es un contador que controla el acceso a recursos compartidos. Existen dos tipos principales: semáforos binarios (similar a un mutex, con valores 0 o 1) y semáforos contadores (permiten múltiples accesos simultáneos hasta un límite definido).',
    problem: 'En sistemas concurrentes, a menudo necesitamos limitar el número de hilos que pueden acceder simultáneamente a un recurso compartido o a una sección crítica. Un mutex solo permite un único acceso, lo que puede ser restrictivo cuando el recurso puede manejar múltiples accesos concurrentes de forma segura.',
    solution: 'Un semáforo mantiene un contador interno que se decrementa cuando un hilo adquiere acceso (operación P o wait) y se incrementa cuando un hilo libera el recurso (operación V o signal). Si el contador llega a cero, los hilos que intenten decrementarlo se bloquearán hasta que otro hilo incremente el contador.',
    applicability: [
      'Control de acceso a un pool de recursos con capacidad limitada (conexiones de base de datos, conexiones de red, etc.)',
      'Limitación del número máximo de hilos que pueden ejecutar cierta sección de código',
      'Sincronización de actividades entre múltiples hilos o procesos',
      'Implementación de mecanismos de señalización entre hilos',
      'Control de la concurrencia en sistemas de colas o buffers limitados',
      'Implementación del patrón productor-consumidor con múltiples productores y/o consumidores'
    ],
    consequences: [
      'Permite un control flexible del nivel de concurrencia, adaptándose a diferentes necesidades',
      'Más versátil que un mutex al permitir múltiples accesos concurrentes',
      'Puede proteger recursos con capacidad definida, optimizando su utilización',
      'Mayor complejidad comparado con mutex, lo que puede llevar a errores sutiles',
      'Riesgo de deadlocks si no se utilizan correctamente las operaciones P y V',
      'Posibles problemas de inversión de prioridad en sistemas con prioridades de hilos',
      'No proporciona protección contra condiciones de carrera dentro de la sección crítica'
    ]
  }
};

export default semaphorePattern; 
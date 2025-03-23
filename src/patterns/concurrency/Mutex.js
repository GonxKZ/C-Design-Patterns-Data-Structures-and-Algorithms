const mutexPattern = {
  id: 'mutex',
  name: 'Mutex',
  category: 'concurrency',
  description: 'Proporciona exclusión mutua para recursos compartidos, garantizando que solo un hilo puede acceder al recurso protegido a la vez, previniendo condiciones de carrera y manteniendo la consistencia de datos.',
  theory: {
    background: 'El término "mutex" proviene de "mutual exclusion" (exclusión mutua) y es una de las primitivas de sincronización más fundamentales en programación concurrente. Conceptualmente, es un candado que garantiza acceso exclusivo a un recurso compartido. Fue formalizado por Edsger Dijkstra como parte de su trabajo en primitivas de sincronización en los años 1960.',
    problem: 'Cuando múltiples hilos acceden y modifican datos compartidos de forma concurrente, pueden ocurrir condiciones de carrera que corrompen el estado del programa. Se necesita un mecanismo que garantice que solo un hilo puede modificar el recurso compartido a la vez.',
    solution: 'Un mutex proporciona dos operaciones principales: lock (bloquear) y unlock (desbloquear). Cuando un hilo necesita acceder al recurso protegido, primero adquiere el mutex llamando a lock(). Si el mutex ya está bloqueado por otro hilo, el hilo actual se bloquea hasta que el mutex esté disponible. Después de procesar el recurso compartido, el hilo libera el mutex con unlock().',
    applicability: [
      'Protección de variables o estructuras de datos compartidas contra accesos concurrentes',
      'Implementación de secciones críticas donde solo un hilo debe ejecutar código a la vez',
      'Base para construir mecanismos de sincronización de más alto nivel',
      'Prevención de condiciones de carrera en operaciones no atómicas',
      'Sincronización entre hilos que deben comunicarse o coordinar sus actividades'
    ],
    consequences: [
      'Garantiza la consistencia de datos al prevenir modificaciones simultáneas',
      'Simplifica el razonamiento sobre código concurrente al establecer puntos de sincronización claros',
      'Puede causar sobrecarga de rendimiento debido a la adquisición y liberación de bloqueos',
      'Riesgo de deadlocks si múltiples mutexes se adquieren en orden incorrecto',
      'Posibles problemas de inversión de prioridad en sistemas con prioridades de hilos',
      'Puede limitar el paralelismo si el granulado del bloqueo es demasiado grueso'
    ]
  }
};

export default mutexPattern; 
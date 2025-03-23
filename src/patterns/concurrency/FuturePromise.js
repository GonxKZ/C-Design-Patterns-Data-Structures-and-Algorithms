const futurePromisePattern = {
  id: 'future-promise',
  name: 'Future & Promise',
  category: 'concurrency',
  description: 'Proporciona mecanismos para representar y gestionar el resultado de operaciones asíncronas, donde la Promise es un contenedor para un valor que puede estar disponible en el futuro, y el Future es un proxy para acceder a ese valor cuando esté listo.',
  theory: {
    background: 'El concepto de Futures fue introducido por Daniel P. Friedman y David Wise en 1976, y posteriormente refinado por Peter Hibbard. Las promesas como construcción explícita fueron formalizadas por Barbara Liskov y Liuba Shrira en 1988. Este patrón ha ganado popularidad con el auge de la programación asíncrona, siendo adoptado en muchos lenguajes modernos como JavaScript, Java, C++, Python y Scala.',
    problem: 'En programación concurrente y asíncrona, los resultados de operaciones pueden no estar disponibles inmediatamente. Se necesita una forma de representar estos resultados futuros y proporcionar mecanismos para acceder a ellos cuando estén listos, sin bloquear innecesariamente el hilo de ejecución.',
    solution: 'El patrón divide la funcionalidad en dos componentes: Promise (escritor) y Future (lector). La Promise representa la operación en curso y permite establecer el resultado cuando esté disponible. El Future actúa como un proxy para ese resultado, permitiendo a los clientes registrar callbacks, encadenar operaciones, o esperar bloqueando hasta que el resultado esté disponible.',
    applicability: [
      'Operaciones asíncronas que producen un resultado que se necesitará más adelante',
      'APIs de red y E/S donde las operaciones pueden tardar tiempo indeterminado',
      'Paralelización de tareas que pueden ejecutarse independientemente',
      'Cuando se necesita encadenar operaciones asíncronas (composición)',
      'Para implementar mecanismos de timeout y cancelación en operaciones largas',
      'En interfaces de usuario para ejecutar operaciones en segundo plano sin bloquear la UI'
    ],
    consequences: [
      'Permite escribir código asíncrono de manera más clara y estructurada',
      'Facilita la paralelización de operaciones independientes',
      'Proporciona mecanismos para gestionar errores en operaciones asíncronas',
      'Permite encadenar operaciones asíncronas (mediante then/flatMap o similar)',
      'Puede complicar la depuración debido a la naturaleza asíncrona y distribuida del flujo de control',
      'Riesgo de fugas de memoria si las referencias a los futures no se gestionan correctamente',
      'Posible sobrecarga por la creación y gestión de objetos Future/Promise en operaciones frecuentes'
    ]
  }
};

export default futurePromisePattern; 
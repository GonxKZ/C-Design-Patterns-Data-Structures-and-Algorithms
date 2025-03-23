const activeObjectPattern = {
  id: 'active-object',
  name: 'Active Object',
  category: 'concurrency',
  description: 'Desacopla la ejecución de métodos de su invocación, permitiendo que las operaciones se ejecuten en hilos separados sin exponer la complejidad de la concurrencia al cliente.',
  theory: {
    background: 'El patrón Active Object fue formalizado por R. Greg Lavender y Douglas C. Schmidt en la década de 1990 como parte del catálogo de patrones de diseño concurrente. Es una evolución del patrón de diseño Object-Oriented que combina la programación orientada a objetos con la concurrencia, permitiendo que los objetos tengan su propio hilo de control.',
    problem: 'En sistemas concurrentes, la sincronización directa entre hilos puede ser compleja y propensa a errores. Los clientes a menudo no necesitan (ni deberían) preocuparse por los detalles de sincronización, bloqueo y programación de tareas concurrentes.',
    solution: 'El patrón Active Object encapsula su propio hilo de ejecución y una cola de solicitudes pendientes. Las invocaciones de métodos se convierten en "solicitudes" que se colocan en una cola y se ejecutan asíncronamente por el hilo del objeto activo. Esto separa el hilo del cliente que hace la solicitud del hilo que ejecuta el método, proporcionando un modelo de concurrencia basado en mensajes.',
    applicability: [
      'Cuando se necesita ejecutar operaciones de forma asíncrona sin bloquear al cliente',
      'Para simplificar la programación concurrente ocultando detalles de sincronización',
      'Cuando un objeto debe procesarse en su propio hilo dedicado',
      'Para implementar concurrencia basada en mensajes en vez de memoria compartida',
      'En sistemas reactivos donde las operaciones se deben procesar secuencialmente pero de forma asíncrona',
      'Para mejorar la responsividad de interfaces de usuario ejecutando operaciones largas en segundo plano'
    ],
    consequences: [
      'Simplifica el código cliente al ocultar la complejidad de la concurrencia',
      'Promueve el paralelismo al permitir que las operaciones se ejecuten en hilos separados',
      'Mejora la modularidad al desacoplar la invocación de métodos de su ejecución',
      'Sobrecarga por la creación y gestión de hilos, colas y mecanismos de sincronización',
      'Posible aumento en la latencia de respuesta debido al encolamiento de solicitudes',
      'Mayor complejidad en la depuración debido a la naturaleza asíncrona',
      'Riesgo de saturación de recursos si se crean demasiados objetos activos'
    ]
  }
};

export default activeObjectPattern; 
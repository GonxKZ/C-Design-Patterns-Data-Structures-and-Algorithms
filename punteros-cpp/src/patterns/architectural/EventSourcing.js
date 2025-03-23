const eventSourcingPattern = {
  id: 'event-sourcing',
  name: 'Event Sourcing',
  category: 'architectural',
  description: 'Captura todos los cambios al estado de una aplicación como una secuencia de eventos a lo largo del tiempo.',
  theory: {
    background: 'El Event Sourcing surgió en el contexto de Domain-Driven Design (DDD) y arquitecturas orientadas a eventos, ganando popularidad en sistemas distribuidos y microservicios.',
    problem: 'Los sistemas tradicionales mantienen solo el estado actual de los datos, perdiendo información histórica valiosa y dificultando auditorías, reconstrucción de estados pasados y análisis temporal.',
    solution: 'Almacenar cada cambio en el estado de la aplicación como una secuencia inmutable de eventos. El estado actual se obtiene reproduciendo estos eventos, y la historia completa está siempre disponible.',
    applicability: [
      'Sistemas que requieren pistas de auditoría completas',
      'Aplicaciones donde la reconstrucción de estados pasados es importante',
      'Sistemas donde la conciliación y resolución de conflictos es necesaria',
      'Aplicaciones que pueden beneficiarse de proyecciones de datos especializadas',
      'Arquitecturas CQRS (Command Query Responsibility Segregation)'
    ],
    consequences: [
      'Registro completo de cambios y posibilidad de reconstruir cualquier estado pasado',
      'Facilita auditorías y análisis temporal de datos',
      'Mejor rendimiento en escritura y capacidad para crear múltiples vistas de datos',
      'Mayor complejidad de implementación y necesidad de manejo de esquemas evolutivos',
      'Posibles desafíos de rendimiento en la reconstrucción de estados'
    ]
  },
  notes: 'Event Sourcing transforma fundamentalmente cómo pensamos sobre el almacenamiento de datos, pasando de un modelo de "estado actual" a un registro histórico completo de eventos. Es particularmente poderoso cuando se combina con CQRS, permitiendo separar los modelos de lectura y escritura. Los eventos inmutables proporcionan una fuente confiable de verdad, y las proyecciones permiten crear vistas optimizadas para casos de uso específicos. Sin embargo, requiere una gestión cuidadosa de la evolución del esquema de eventos y consideraciones sobre el rendimiento para sistemas con grandes volúmenes de eventos.'
};

export default eventSourcingPattern; 
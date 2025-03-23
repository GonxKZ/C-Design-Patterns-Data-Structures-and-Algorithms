const antiCorruptionLayerPattern = {
  id: 'anti-corruption-layer',
  name: 'Anti-Corruption Layer',
  category: 'architectural',
  description: 'Implementa una capa de traducción entre subsistemas con modelos de dominio diferentes, preservando la integridad del modelo de dominio principal y facilitando la interoperabilidad sin contaminación conceptual.',
  theory: {
    background: 'El patrón Anti-Corruption Layer (ACL) fue introducido por Eric Evans en su libro "Domain-Driven Design" como una técnica para proteger el modelo de dominio principal cuando se integra con sistemas externos o heredados. El nombre refleja su propósito: evitar que conceptos y modelos extraños "corrompan" la integridad del modelo de dominio central.',
    problem: 'Cuando diferentes subsistemas o aplicaciones necesitan integrarse, surgen varios desafíos: 1) Los sistemas pueden tener modelos de dominio incompatibles o conceptos que no se alinean, 2) La integración directa puede llevar a compromisos que degradan la integridad del modelo principal, 3) Los cambios en sistemas externos pueden propagarse al sistema principal, creando acoplamiento indeseado, 4) Los sistemas heredados pueden tener diseños problemáticos o anticuados que no deberían influir en los nuevos diseños.',
    solution: 'Implementar una capa de traducción específica entre el sistema principal y otros sistemas con los que debe integrarse. Esta capa: a) Traduce entre los diferentes modelos de dominio, manteniendo conceptos separados, b) Encapsula la lógica de comunicación con el sistema externo, c) Aísla el impacto de los cambios en sistemas externos, d) Implementa adaptadores que convierten datos y protocolos entre los sistemas, e) Puede incluir fachadas, adaptadores y otros patrones de integración como componentes.',
    applicability: [
      'Integración con sistemas heredados que tienen modelos de dominio diferentes',
      'Cuando se colabora con otros equipos que mantienen su propio modelo de dominio',
      'Durante migraciones graduales donde coexisten modelos antiguos y nuevos',
      'Sistemas que consumen APIs externas con conceptos y modelos distintos',
      'Cuando se quiere proteger un modelo de dominio bien diseñado de influencias externas'
    ],
    consequences: [
      'Preservación de la integridad y pureza del modelo de dominio principal',
      'Aislamiento frente a cambios en los sistemas externos',
      'Clara separación de responsabilidades en la integración entre sistemas',
      'Facilita la evolución independiente de los diferentes modelos',
      'Introduce una capa adicional que debe mantenerse y puede añadir complejidad',
      'Posible impacto en el rendimiento debido a las traducciones adicionales',
      'Requiere un buen entendimiento de ambos modelos de dominio para implementar traducciones correctas'
    ]
  },
  notes: 'El Anti-Corruption Layer puede ser implementado usando diversos patrones de diseño, siendo los más comunes el Adapter, Facade y el patrón Translator. La implementación puede variar desde una simple biblioteca de traducción hasta un servicio dedicado completo, dependiendo de la complejidad de la integración. En equipos grandes que trabajan en diferentes bounded contexts (contextos delimitados), este patrón es fundamental para mantener la autonomía de los equipos mientras permiten la integración entre subsistemas. El patrón ACL es particularmente útil en implementaciones de arquitectura hexagonal, donde forma parte de los adaptadores que conectan el dominio con el mundo exterior.'
};

export default antiCorruptionLayerPattern; 
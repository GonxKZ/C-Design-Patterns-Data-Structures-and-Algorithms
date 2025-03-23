const filterPattern = {
  id: 'filter',
  name: 'Filter',
  category: 'structural',
  description: 'También conocido como Criteria, permite filtrar un conjunto de objetos utilizando diferentes criterios encadenables, proporcionando una forma flexible de seleccionar subconjuntos basados en atributos específicos.',
  theory: {
    background: 'El patrón Filter, también conocido como Criteria, es un patrón estructural que no forma parte del catálogo original de Gang of Four, pero ha ganado popularidad en el desarrollo de aplicaciones modernas. Es especialmente útil en sistemas donde se necesita filtrar colecciones de objetos según múltiples criterios que pueden combinarse de diferentes maneras. Este patrón está íntimamente relacionado con el patrón Specification en Domain-Driven Design.',
    problem: 'Cuando trabajamos con colecciones de objetos, a menudo necesitamos seleccionar subconjuntos basados en ciertos criterios. Codificar estos filtros directamente en la lógica de negocio puede resultar en código rígido y difícil de mantener, especialmente cuando los criterios de filtrado son numerosos, complejos o cambiantes.',
    solution: 'Crear una interfaz común para los filtros (Criteria) que define un método para filtrar colecciones. Implementar filtros concretos para cada criterio individual y filtros compuestos que combinan criterios mediante operadores lógicos (AND, OR, NOT). Esto permite construir expresiones de filtrado complejas componiendo filtros simples.',
    applicability: [
      'Cuando se necesita filtrar colecciones de objetos según múltiples criterios',
      'Para separar la lógica de filtrado de los objetos que están siendo filtrados',
      'Cuando los criterios de filtrado deben ser componibles (usando AND, OR, NOT)',
      'Para implementar búsqueda y consulta avanzadas en aplicaciones',
      'Cuando los criterios de filtrado pueden cambiar o extenderse frecuentemente'
    ],
    consequences: [
      'Alta flexibilidad para combinar criterios de filtrado de diferentes maneras',
      'Respeta el principio Open/Closed: se pueden añadir nuevos criterios sin modificar el código existente',
      'Mejora la legibilidad del código al expresar criterios complejos como composiciones de criterios simples',
      'Puede añadir sobrecarga por la creación de múltiples objetos pequeños para criterios',
      'Para conjuntos de datos muy grandes, puede ser menos eficiente que soluciones específicas como SQL',
      'Puede volverse complejo si hay demasiados tipos de criterios diferentes',
      'Posible impacto en el rendimiento al encadenar múltiples filtros en largas cadenas'
    ]
  }
};

export default filterPattern; 
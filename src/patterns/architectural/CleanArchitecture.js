const cleanArchitecturePattern = {
  id: 'clean-architecture',
  name: 'Clean Architecture',
  category: 'architectural',
  description: 'Organiza la aplicación en capas concéntricas con dependencias dirigidas hacia el centro, logrando independencia de frameworks y facilitando las pruebas.',
  
  theory: {
    background: 'Clean Architecture fue propuesta por Robert C. Martin (Uncle Bob) como una evolución de patrones arquitectónicos anteriores como Hexagonal Architecture y Onion Architecture. Unifica principios comunes de varias arquitecturas para crear sistemas independientes de frameworks, probables y mantenibles.',
    problem: 'Los sistemas software tienden a acoplarse fuertemente a tecnologías, frameworks y bases de datos específicas, haciendo difícil evolucionar, probar y mantener el código a largo plazo.',
    solution: 'Organizar el código en capas concéntricas con reglas de dependencia estrictas: las capas externas pueden depender de las internas, pero nunca al revés. El centro contiene las reglas de negocio y entidades empresariales.',
    applicability: [
      "Sistemas complejos con larga vida útil esperada",
      "Aplicaciones donde la lógica de negocio debe ser independiente de la infraestructura",
      "Software que requiere alta capacidad de prueba",
      "Sistemas que pueden necesitar cambiar de frameworks o bases de datos"
    ],
    consequences: [
      "Independencia de frameworks y tecnologías externas",
      "Alta testabilidad de la lógica de negocio central",
      "Mayor mantenibilidad y flexibilidad a largo plazo",
      "Puede requerir más código inicial y configuración",
      "Curva de aprendizaje más pronunciada para desarrolladores acostumbrados a arquitecturas menos estructuradas"
    ]
  },
  
  notes: 'Clean Architecture define cuatro capas principales: Entidades (reglas de negocio centrales), Casos de Uso (reglas específicas de la aplicación), Adaptadores de Interfaz (conversores entre casos de uso y elementos externos) y Frameworks/Drivers (componentes externos). El principio fundamental es la Regla de Dependencia: las dependencias del código fuente sólo pueden apuntar hacia adentro. Para lograr esto, se utilizan ampliamente el Principio de Inversión de Dependencia y las interfaces. Esta arquitectura es particularmente valiosa en sistemas empresariales complejos y aplicaciones que deben mantenerse durante muchos años. Si bien requiere más esfuerzo inicial, proporciona beneficios significativos en términos de mantenibilidad, testabilidad y capacidad para evolucionar con los cambios tecnológicos.'
};

export default cleanArchitecturePattern; 
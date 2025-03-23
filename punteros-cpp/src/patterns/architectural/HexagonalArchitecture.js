const hexagonalArchitecturePattern = {
  id: 'hexagonal-architecture',
  name: 'Hexagonal Architecture (Ports and Adapters)',
  category: 'architectural',
  description: 'Aísla el núcleo de la aplicación de las influencias externas mediante puertos y adaptadores, permitiendo que la aplicación sea dirigida igualmente por usuarios, programas, pruebas automatizadas o lotes.',
  
  theory: {
    background: 'Hexagonal Architecture fue propuesta por Alistair Cockburn en 2005 como una forma de crear aplicaciones con alta capacidad de prueba y mantenimiento. También se conoce como "Ports and Adapters" debido a sus componentes clave.',
    problem: 'Las aplicaciones tradicionales mezclan lógica de negocio con código de interfaz o infraestructura, creando sistemas difíciles de probar y mantener que no pueden funcionar sin sus dependencias externas.',
    solution: 'Aislar la lógica de negocio central (el hexágono) y definir puertos (interfaces) para la comunicación con el exterior. Los adaptadores traducen entre el mundo exterior y estos puertos, permitiendo que la lógica central sea agnóstica a los detalles de implementación externa.',
    applicability: [
      "Sistemas que requieren alta capacidad de prueba",
      "Aplicaciones que deben soportar múltiples formas de entrada y salida",
      "Software que necesita aislamiento de sus dependencias externas",
      "Sistemas que experimentarán cambios significativos en sus interfaces o infraestructuras"
    ],
    consequences: [
      "Alta capacidad de prueba sin dependencias externas",
      "Flexibilidad para cambiar componentes externos sin afectar el núcleo",
      "Posibilidad de desarrollo en paralelo de diferentes aspectos del sistema",
      "Mayor complejidad inicial y más código comparado con enfoques monolíticos",
      "Curva de aprendizaje para desarrolladores acostumbrados a arquitecturas más tradicionales"
    ]
  },
  
  notes: 'En Hexagonal Architecture, los puertos definen interfaces para que la aplicación se comunique con actores externos, y los adaptadores implementan estas interfaces para conectar con tecnologías específicas. Existen adaptadores primarios o "driving" (que inician interacciones con la aplicación) y adaptadores secundarios o "driven" (que la aplicación usa para hablar con sistemas externos). Esta arquitectura es similar a Clean Architecture y Onion Architecture en sus principios fundamentales. La visualización hexagonal enfatiza que no hay un "lado frontal" o "lado trasero", solo diferentes formas en que la aplicación interactúa con el mundo exterior. Este enfoque facilita enormemente las pruebas, ya que los casos de uso pueden probarse sin necesidad de infraestructura real mediante adaptadores de prueba simples.'
};

export default hexagonalArchitecturePattern; 
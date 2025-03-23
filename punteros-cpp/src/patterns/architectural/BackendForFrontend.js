const backendForFrontendPattern = {
  id: 'backend-for-frontend',
  name: 'Backend For Frontend (BFF)',
  category: 'architectural',
  description: 'Crea servicios de backend específicos y optimizados para cada tipo de cliente (web, móvil, IoT), ofreciendo APIs personalizadas que se ajustan exactamente a las necesidades de cada interfaz de usuario.',
  theory: {
    background: 'El patrón Backend For Frontend (BFF) fue popularizado por Sam Newman y el equipo de SoundCloud como una evolución del patrón API Gateway. Surgió como respuesta a los desafíos de crear una única API que sirviera eficientemente a diferentes tipos de clientes con necesidades divergentes.',
    problem: 'Los distintos tipos de clientes (web, móvil, IoT, etc.) tienen necesidades diferentes en términos de datos, granularidad de operaciones y restricciones técnicas. Un único backend genérico para todos ellos implica: 1) Complejidad para manejar todas las variantes de necesidades, 2) Ineficiencias al enviar datos innecesarios a ciertos clientes, 3) Dificultad para optimizar la API para casos de uso específicos, 4) Acoplamiento entre equipos de desarrollo que trabajan en diferentes interfaces.',
    solution: 'Implementar backends separados y especializados para cada tipo de cliente importante. Cada BFF: a) Se diseña específicamente para las necesidades de un tipo de cliente, b) Es mantenido por el mismo equipo que desarrolla la interfaz de usuario correspondiente, c) Puede optimizar el formato de datos, protocolos y operaciones para su cliente específico, d) Actúa como una capa de agregación y transformación entre los microservicios backend y el frontend.',
    applicability: [
      'Sistemas con múltiples tipos de clientes (web, móvil, televisores, IoT) con necesidades divergentes',
      'Equipos organizados por tipo de cliente o plataforma',
      'Cuando las optimizaciones específicas por cliente ofrecen beneficios significativos en rendimiento o experiencia de usuario',
      'Aplicaciones donde diferentes clientes necesitan distintos subconjuntos o formatos de datos',
      'Entornos donde se busca autonomía entre equipos de desarrollo frontend'
    ],
    consequences: [
      'APIs optimizadas para las necesidades específicas de cada tipo de cliente',
      'Mejora del rendimiento al reducir el volumen de datos y transformaciones en el cliente',
      'Mayor autonomía para los equipos de desarrollo frontend',
      'Posibilidad de evolucionar cada BFF independientemente según las necesidades del cliente',
      'Duplicación potencial de código y lógica entre diferentes BFFs',
      'Aumento de la complejidad operativa al mantener múltiples servicios backend',
      'Posible inconsistencia en la implementación de funcionalidades similares entre BFFs'
    ]
  },
  notes: 'El patrón BFF se considera una especialización del patrón API Gateway, donde hay múltiples gateways, cada uno dedicado a un tipo específico de cliente. Es importante establecer límites claros entre la lógica que debe residir en los microservicios de dominio (compartida por todos los clientes) y la que debe estar en los BFFs (específica del cliente). Para maximizar los beneficios y minimizar la duplicación, es común extraer funcionalidades comunes entre BFFs a bibliotecas compartidas o servicios de utilidad. En organizaciones grandes, este patrón se alinea bien con la estructura de "equipos de funcionalidad vertical" que son responsables de toda la pila tecnológica para una experiencia de usuario específica.'
};

export default backendForFrontendPattern; 
const apiGatewayPattern = {
  id: 'api-gateway',
  name: 'API Gateway',
  category: 'architectural',
  description: 'Proporciona un punto de entrada unificado para clientes que interactúan con un conjunto de microservicios, encapsulando la arquitectura interna del sistema y ofreciendo APIs personalizadas según las necesidades del cliente.',
  theory: {
    background: 'El patrón API Gateway surgió con la popularización de las arquitecturas de microservicios como solución a los desafíos de comunicación entre clientes y un ecosistema de servicios. Se basa en el concepto de fachada (Facade) pero a nivel de sistema, y ha sido popularizado por empresas como Netflix, Amazon y otras organizaciones pioneras en microservicios.',
    problem: 'En arquitecturas de microservicios, los clientes enfrentan varios desafíos: 1) Necesidad de realizar múltiples llamadas a diferentes servicios para construir una vista completa, 2) Protocolos y formatos de comunicación posiblemente diferentes entre servicios, 3) Complejidad en la gestión de múltiples endpoints, 4) Sobrecarga de red, especialmente en clientes móviles, 5) Falta de capacidades transversales centralizadas como autenticación y monitorización.',
    solution: 'Implementar un componente intermediario (API Gateway) que actúa como punto de entrada único para todas las solicitudes de los clientes. El gateway: a) Enruta las solicitudes a los servicios apropiados, b) Agrega respuestas de múltiples servicios cuando sea necesario, c) Traduce entre protocolos si es preciso, d) Ofrece capacidades transversales como autenticación, autorización, limitación de tasa, caching, y monitorización.',
    applicability: [
      'Arquitecturas de microservicios con múltiples servicios backend',
      'Sistemas con diversos tipos de clientes (web, móvil, IoT) con diferentes necesidades',
      'Cuando se requiere una capa de abstracción entre clientes y servicios para ocultar detalles de implementación',
      'Entornos donde se necesitan funcionalidades transversales consistentes (seguridad, monitorización, throttling)',
      'Aplicaciones que requieren agregación de datos de múltiples servicios para minimizar viajes de red'
    ],
    consequences: [
      'Simplificación de la experiencia del cliente al interactuar con el sistema',
      'Reducción del número de solicitudes entre cliente y servidor mediante agregación',
      'Abstracción de la arquitectura interna, permitiendo evolucionar servicios sin impactar clientes',
      'Centralización de preocupaciones transversales como seguridad y monitorización',
      'Posible introducción de un punto único de fallo si no se diseña con redundancia',
      'Riesgo de convertirse en un cuello de botella si no se escala adecuadamente',
      'Complejidad adicional en la implementación y mantenimiento del gateway'
    ]
  },
  notes: 'Existen variantes comunes del patrón API Gateway: 1) Gateway único para todo el sistema, 2) Gateways específicos por tipo de cliente (Backend for Frontend o BFF), donde cada tipo de cliente tiene su propio gateway optimizado. Herramientas populares para implementar API Gateways incluyen Kong, Apigee, Amazon API Gateway, Azure API Management, y Spring Cloud Gateway. En microservicios maduros, es común implementar patrones complementarios como Service Discovery y Circuit Breaker junto con API Gateway para mejorar la resiliencia y la operabilidad.'
};

export default apiGatewayPattern; 
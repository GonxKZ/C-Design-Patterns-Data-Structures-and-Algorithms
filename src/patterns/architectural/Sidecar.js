const sidecarPattern = {
  id: 'sidecar',
  name: 'Sidecar',
  category: 'architectural',
  description: 'Despliega componentes auxiliares como procesos o contenedores independientes junto a la aplicación principal, encapsulando funcionalidades comunes y permitiendo su desarrollo, actualización y mantenimiento de forma separada.',
  theory: {
    background: 'El patrón Sidecar (también conocido como Sidekick o Servicio Adjunto) surgió en el contexto de arquitecturas de microservicios y contenedores. Toma su nombre de los sidecar de motocicletas, que son componentes adjuntos que proporcionan funcionalidad adicional. Ganó popularidad con la adopción de tecnologías como Kubernetes y service mesh como Istio y Linkerd.',
    problem: 'En sistemas distribuidos, existen funcionalidades transversales comunes a múltiples servicios (logging, monitorización, seguridad, descubrimiento, etc.) que: 1) Aumentan la complejidad del código principal si se implementan en cada servicio, 2) Crean dependencias tecnológicas que dificultan usar lenguajes diversos, 3) Requieren actualización y mantenimiento consistentes en todos los servicios, 4) Distraen a los desarrolladores de la lógica de negocio central.',
    solution: 'Implementar funcionalidades transversales en componentes independientes (sidecars) que se despliegan junto al servicio principal. El sidecar: a) Se ejecuta en el mismo contexto (host, pod, etc.) que el servicio principal, b) Comparte recursos como sistema de archivos y red, c) Proporciona o extiende las capacidades del servicio principal, d) Puede ser desarrollado, desplegado y actualizado de forma independiente.',
    applicability: [
      'Aplicaciones distribuidas donde múltiples servicios requieren funcionalidades transversales comunes',
      'Entornos que utilizan múltiples lenguajes de programación y tecnologías',
      'Sistemas donde se necesita extender servicios existentes sin modificarlos',
      'Arquitecturas que requieren actualizar componentes de infraestructura sin afectar la lógica de negocio',
      'Cuando se busca desacoplar las preocupaciones de infraestructura de la lógica de aplicación'
    ],
    consequences: [
      'Separación clara de responsabilidades entre lógica de negocio y funcionalidades transversales',
      'Posibilidad de usar diferentes tecnologías para el servicio principal y los sidecars',
      'Actualización y mantenimiento independientes de los componentes transversales',
      'Reutilización de implementaciones comunes a través de diferentes servicios',
      'Mayor complejidad en la arquitectura de despliegue',
      'Overhead adicional en consumo de recursos (memoria, CPU)',
      'Posible latencia adicional en las comunicaciones que pasan por el sidecar'
    ]
  },
  notes: 'Casos de uso comunes para sidecars incluyen: proxy de servicios, monitorización, logging, autenticación y autorización, cifrado y TLS, descubrimiento de servicios, y circuit breaking. El patrón Sidecar es un componente fundamental de las arquitecturas de service mesh como Istio, Linkerd y Consul Connect. En Kubernetes, se implementa típicamente como contenedores adicionales dentro del mismo pod. Para maximizar los beneficios, es importante mantener una clara separación de responsabilidades y asegurar que la comunicación entre el servicio principal y el sidecar sea eficiente.'
};

export default sidecarPattern; 
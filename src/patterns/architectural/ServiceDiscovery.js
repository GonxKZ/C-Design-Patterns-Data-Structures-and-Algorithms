const serviceDiscoveryPattern = {
  id: 'service-discovery',
  name: 'Service Discovery',
  category: 'architectural',
  description: 'Proporciona un mecanismo para que los servicios encuentren y se comuniquen entre sí dinámicamente sin conocer de antemano sus ubicaciones exactas en una red.',
  theory: {
    background: 'El patrón Service Discovery surgió como una respuesta a los desafíos de comunicación entre servicios en entornos dinámicos, especialmente en arquitecturas de microservicios y en la nube. Se ha vuelto esencial a medida que los sistemas han evolucionado desde infraestructuras estáticas hacia despliegues dinámicos con contenedores, orquestadores y escalado automático.',
    problem: 'En entornos modernos y distribuidos, los servicios enfrentan varios desafíos de comunicación: 1) Direcciones IP y puertos dinámicos debido al escalado horizontal, 2) Creación y destrucción frecuente de instancias de servicio, 3) Implementaciones en múltiples centros de datos o zonas de disponibilidad, 4) Necesidad de balanceo de carga entre instancias disponibles, 5) Gestión manual de configuraciones de red inviable a escala.',
    solution: 'Implementar un mecanismo que permita el registro automático de servicios y su descubrimiento por parte de otros servicios. Este mecanismo puede funcionar de dos formas principales: a) Server-side Discovery, donde un registro central conoce la ubicación de todos los servicios y dirige las solicitudes, o b) Client-side Discovery, donde el cliente consulta un registro y luego se comunica directamente con el servicio seleccionado.',
    applicability: [
      'Arquitecturas de microservicios donde los servicios necesitan comunicarse entre sí',
      'Entornos con infraestructura dinámica (contenedores, orquestadores, nube)',
      'Sistemas que requieren escalado horizontal y elasticidad',
      'Cuando se necesita balanceo de carga entre múltiples instancias de servicio',
      'Despliegues en múltiples zonas o regiones para alta disponibilidad'
    ],
    consequences: [
      'Mayor resiliencia ante cambios dinámicos en la infraestructura',
      'Facilita el escalado horizontal y la elasticidad del sistema',
      'Simplifica la configuración de red al eliminar la necesidad de configuraciones estáticas',
      'Permite implementar estrategias avanzadas como routing basado en cercanía geográfica',
      'Añade complejidad al sistema con componentes adicionales',
      'El registro de servicios puede convertirse en un punto único de fallo si no se diseña con redundancia',
      'Latencia adicional en la resolución de ubicaciones de servicio'
    ]
  },
  notes: 'Herramientas populares para implementar Service Discovery incluyen Consul, etcd, ZooKeeper, Netflix Eureka y las capacidades integradas en plataformas como Kubernetes o AWS ECS. Para implementaciones client-side, bibliotecas como Ribbon (Java) facilitan la integración. El patrón Service Discovery suele complementarse con otros patrones como Circuit Breaker para mayor resiliencia. En entornos de microservicios, es común implementar health checks para detectar automáticamente servicios no saludables y retirarlos del registro.'
};

export default serviceDiscoveryPattern; 
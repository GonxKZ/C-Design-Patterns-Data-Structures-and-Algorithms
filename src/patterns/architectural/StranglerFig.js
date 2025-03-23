const stranglerFigPattern = {
  id: 'strangler-fig',
  name: 'Strangler Fig',
  category: 'architectural',
  description: 'Permite la migración gradual de un sistema heredado a una nueva arquitectura mediante la intercepción y sustitución incremental de funcionalidades, mientras ambos sistemas coexisten.',
  theory: {
    background: 'El patrón Strangler Fig fue introducido por Martin Fowler en 2004, inspirado en la higuera estranguladora (Ficus) que crece alrededor de otros árboles gradualmente hasta reemplazarlos. Esta metáfora captura la esencia de cómo se puede transformar un sistema heredado de manera gradual y segura sin necesidad de una migración completa y riesgosa de una sola vez.',
    problem: 'La migración o reemplazo completo de sistemas heredados enfrenta varios desafíos: 1) Alto riesgo y costo asociado con la reescritura total, 2) Interrupción del negocio durante migraciones tipo "big bang", 3) Dificultad para mantener la funcionalidad actual mientras se desarrolla el nuevo sistema, 4) Probabilidad de introducir errores críticos en la transición, 5) Resistencia organizacional a cambios drásticos.',
    solution: 'Crear un nuevo sistema alrededor del existente, interceptando las llamadas al sistema original y redirigiendo progresivamente la funcionalidad hacia el nuevo sistema. El proceso sigue estos pasos: a) Identificar componentes que pueden extraerse con mínima dependencia, b) Implementar una capa de fachada/proxy que intercepta el tráfico, c) Desarrollar nuevos componentes en la arquitectura moderna, d) Redirigir gradualmente el tráfico hacia los nuevos componentes, e) Eventualmente, retirar el sistema heredado cuando todas sus funcionalidades hayan sido reemplazadas.',
    applicability: [
      'Sistemas heredados críticos para el negocio que no pueden detenerse para un reemplazo total',
      'Aplicaciones monolíticas que necesitan ser modernizadas o migradas a microservicios',
      'Cuando la migración debe realizarse con riesgo mínimo y sin interrupciones importantes',
      'Proyectos donde el presupuesto y los recursos requieren una transformación progresiva',
      'Sistemas donde el conocimiento del dominio está incompleto o disperso'
    ],
    consequences: [
      'Reducción del riesgo al permitir reversiones parciales si algo sale mal',
      'Entrega de valor incremental a lo largo del tiempo en lugar de esperar una migración completa',
      'Capacidad para aprender y ajustar la estrategia durante el proceso de migración',
      'Coexistencia temporal de múltiples tecnologías y arquitecturas',
      'Necesidad de mantener ambos sistemas durante el período de transición',
      'Posible complejidad adicional en la integración entre sistemas durante la migración',
      'Riesgo de que la migración nunca se complete si no hay compromiso organizacional'
    ]
  },
  notes: 'El éxito del patrón Strangler Fig depende de identificar los límites naturales dentro del sistema existente por donde "estrangular" y comenzar la migración. Técnicas complementarias incluyen el uso de API Gateways o proxies para interceptar y redirigir llamadas, implementación de Branch by Abstraction para aislar cambios, y Event Interception para capturar y replicar eventos entre sistemas. Este patrón se aplica no solo a migraciones tecnológicas sino también a transformaciones de arquitectura más amplias, como de monolitos a microservicios o migraciones a la nube.'
};

export default stranglerFigPattern; 
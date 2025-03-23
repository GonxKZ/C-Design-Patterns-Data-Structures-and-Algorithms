const mvvmPattern = {
  id: 'mvvm',
  name: 'MVVM (Model-View-ViewModel)',
  category: 'architectural',
  description: 'Patrón arquitectónico que separa la lógica de negocio y presentación de la interfaz de usuario mediante la vinculación de datos bidireccional.',
  
  theory: {
    background: 'MVVM fue introducido por Microsoft como parte de la plataforma WPF para facilitar la separación entre la interfaz gráfica y la lógica. Está diseñado específicamente para aprovechar las tecnologías de enlace de datos (data binding).',
    problem: 'La necesidad de separar la interfaz de usuario de la lógica de presentación y negocio, mientras se mantiene la sincronización automática entre la vista y los datos subyacentes.',
    solution: 'Introducir un ViewModel que actúa como intermediario entre el Modelo y la Vista, y proporciona enlace de datos bidireccional para mantener ambos sincronizados automáticamente.',
    applicability: [
      "Aplicaciones con interfaces de usuario complejas que requieren sincronización automática",
      "Sistemas que utilizan tecnologías con soporte para enlace de datos (data binding)",
      "Aplicaciones donde se requiere una clara separación entre UI y lógica de negocio",
      "Desarrollo donde se utilizan herramientas de diseño visual que necesitan separación de código"
    ],
    consequences: [
      "Mayor facilidad para el desarrollo paralelo de UI y lógica",
      "Sincronización automática entre la vista y los datos subyacentes",
      "Mejor capacidad de prueba de la lógica de presentación",
      "Puede introducir complejidad adicional en comparación con MVC para aplicaciones simples",
      "Requiere infraestructura de enlace de datos para ser realmente efectivo"
    ]
  },
  
  notes: 'MVVM es especialmente popular en frameworks modernos como Angular, Vue.js, WPF, Xamarin y SwiftUI. La característica distintiva es el enlace de datos bidireccional, donde los cambios en la UI se reflejan automáticamente en el ViewModel y viceversa. A diferencia de MVP, el ViewModel no tiene referencia directa a la Vista, lo que permite una mejor separación de responsabilidades. MVVM se beneficia enormemente de características como propiedades observables, comandos y conversores de datos. En aplicaciones web modernas, los frameworks de JavaScript implementan variaciones de MVVM con "reactividad" como concepto central. Este patrón es ideal para interfaces de usuario ricas y complejas donde la sincronización manual de datos sería tediosa y propensa a errores.'
};

export default mvvmPattern; 
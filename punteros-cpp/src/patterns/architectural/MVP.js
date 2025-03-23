const mvpPattern = {
  id: 'mvp',
  name: 'MVP (Model-View-Presenter)',
  category: 'architectural',
  description: 'Variante del MVC donde el Presentador asume la responsabilidad de la lógica de presentación, actuando como intermediario entre el Modelo y la Vista.',
  
  theory: {
    background: 'El patrón MVP surgió como una evolución del MVC para abordar algunas de sus limitaciones, especialmente en interfaces de usuario complejas. Ganó popularidad con el desarrollo de interfaces de usuario en aplicaciones de escritorio y web.',
    problem: 'En MVC tradicional, a veces la Vista tiene demasiada lógica de presentación y conocimiento del Modelo, lo que dificulta las pruebas unitarias y crea dependencias innecesarias.',
    solution: 'Introducir un Presentador que coordine completamente la Vista y el Modelo. La Vista se vuelve pasiva (interfaz tonta) y el Presentador contiene toda la lógica de presentación.',
    applicability: [
      "Aplicaciones con lógica de presentación compleja",
      "Sistemas donde se requiere alta capacidad de prueba",
      "Interfaces de usuario que necesitan separación estricta entre vista y lógica",
      "Aplicaciones donde la Vista debe ser lo más pasiva posible"
    ],
    consequences: [
      "Mayor facilidad para realizar pruebas unitarias del presentador sin la UI",
      "Clara separación de responsabilidades",
      "La Vista se vuelve una 'interfaz tonta' que solo muestra datos",
      "Mayor número de clases e interfaces en comparación con MVC",
      "El Presentador puede volverse complejo si no se diseña adecuadamente"
    ]
  },
  
  notes: 'El patrón MVP es especialmente popular en el desarrollo de aplicaciones Android y en frameworks de desarrollo web. Existen dos variantes principales: MVP Pasivo (la Vista es completamente pasiva) y MVP Supervisado (la Vista tiene algo de lógica). MVP facilita significativamente las pruebas unitarias, ya que el Presentador no depende de componentes de UI específicos. En comparación con MVC, MVP tiene una separación más clara entre la lógica de presentación y la interfaz de usuario, pero puede requerir más código boilerplate. En sistemas modernos, este patrón a menudo se combina con inyección de dependencias para facilitar aún más las pruebas.'
};

export default mvpPattern; 
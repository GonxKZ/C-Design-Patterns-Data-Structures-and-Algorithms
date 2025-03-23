// Quiz sobre Introducción a los Punteros
export const quizIntroduccion = [
  {
    pregunta: "¿Qué es un puntero en C++?",
    opciones: [
      "Un tipo de dato que almacena el valor de una variable",
      "Un tipo de dato que almacena la dirección de memoria de una variable",
      "Un objeto que permite iterar sobre colecciones",
      "Una función que apunta a otra función"
    ],
    respuestaCorrecta: 1,
    explicacion: "Un puntero en C++ es un tipo de dato que almacena la dirección de memoria de una variable, permitiendo acceso directo a ese espacio de memoria."
  },
  {
    pregunta: "¿Cuál es la principal diferencia entre C++ y Java en cuanto al manejo de memoria?",
    opciones: [
      "Java utiliza únicamente punteros mientras que C++ utiliza referencias",
      "C++ permite la gestión manual de memoria mientras que Java utiliza recolector de basura",
      "C++ no puede acceder directamente a la memoria mientras que Java sí",
      "No hay diferencias, ambos lenguajes manejan la memoria de la misma forma"
    ],
    respuestaCorrecta: 1,
    explicacion: "C++ permite la gestión manual de memoria a través de punteros, con operaciones como new y delete, mientras que Java utiliza un recolector de basura automático."
  },
  {
    pregunta: "¿Por qué son útiles los punteros en C++?",
    opciones: [
      "Porque hacen que el código se ejecute más rápido en todos los casos",
      "Porque permiten crear arrays de tamaño infinito",
      "Porque permiten pasar argumentos por referencia y crear estructuras de datos dinámicas",
      "Porque son más seguros que las variables normales"
    ],
    respuestaCorrecta: 2,
    explicacion: "Los punteros son útiles porque permiten pasar datos por referencia (evitando copias innecesarias), crear estructuras de datos dinámicas como listas enlazadas y árboles, y manipular la memoria directamente."
  }
];

// Quiz sobre Declaración de Punteros
export const quizDeclaracion = [
  {
    pregunta: "¿Cuál es la sintaxis correcta para declarar un puntero a un entero?",
    opciones: [
      "int ptr;",
      "pointer int ptr;",
      "int *ptr;",
      "int& ptr;"
    ],
    respuestaCorrecta: 2,
    explicacion: "La sintaxis correcta es 'int *ptr;'. El asterisco * indica que la variable es un puntero que puede almacenar la dirección de un entero."
  },
  {
    pregunta: "¿Qué valor tiene inicialmente un puntero no inicializado?",
    opciones: [
      "0",
      "Un valor aleatorio (basura)",
      "NULL",
      "La dirección de la primera variable definida"
    ],
    respuestaCorrecta: 1,
    explicacion: "Un puntero no inicializado contiene un valor aleatorio (basura). Esto puede causar comportamientos impredecibles si se intenta desreferenciar, por lo que es importante inicializarlo."
  },
  {
    pregunta: "¿Qué hace el operador '&' cuando se utiliza con una variable?",
    opciones: [
      "Crea una referencia a la variable",
      "Obtiene el valor almacenado en la dirección de memoria",
      "Devuelve la dirección de memoria de la variable",
      "Compara dos variables"
    ],
    respuestaCorrecta: 2,
    explicacion: "El operador '&' (operador de dirección) devuelve la dirección de memoria donde se encuentra almacenada una variable. Por ejemplo: &x devuelve la dirección de x."
  }
];

// Quiz sobre Operaciones con Punteros
export const quizOperaciones = [
  {
    pregunta: "¿Qué hace el operador '*' cuando se usa con un puntero?",
    opciones: [
      "Multiplica el valor del puntero",
      "Accede a la dirección de memoria almacenada en el puntero",
      "Accede al valor almacenado en la dirección de memoria apuntada",
      "Crea un nuevo puntero"
    ],
    respuestaCorrecta: 2,
    explicacion: "El operador '*' (operador de desreferencia) accede al valor almacenado en la dirección de memoria a la que apunta el puntero. Por ejemplo: *ptr accede al valor almacenado en la dirección guardada en ptr."
  },
  {
    pregunta: "¿Qué operación realiza el siguiente código: ptr++?",
    opciones: [
      "Incrementa la dirección de memoria en 1 byte",
      "Incrementa la dirección de memoria en el tamaño del tipo de dato al que apunta",
      "Incrementa el valor al que apunta el puntero",
      "Es un error de sintaxis"
    ],
    respuestaCorrecta: 1,
    explicacion: "ptr++ incrementa la dirección de memoria almacenada en el puntero en el tamaño del tipo de dato al que apunta. Por ejemplo, si ptr es un puntero a int (4 bytes), ptr++ incrementará la dirección en 4 bytes."
  },
  {
    pregunta: "¿Qué significa desreferenciar un puntero nulo?",
    opciones: [
      "Asignar un valor a un puntero",
      "Intentar acceder al valor en la dirección 0, lo que causa un error",
      "Liberar la memoria asignada a un puntero",
      "Comparar un puntero con NULL"
    ],
    respuestaCorrecta: 1,
    explicacion: "Desreferenciar un puntero nulo significa intentar acceder al valor en la dirección 0 (NULL), lo que resulta en un comportamiento indefinido, generalmente un error o excepción de 'segmentation fault'."
  }
];

// Quiz sobre Punteros y Arreglos
export const quizArreglos = [
  {
    pregunta: "¿Cuál es la relación entre arrays y punteros en C++?",
    opciones: [
      "Los arrays son estructuras completamente diferentes a los punteros",
      "Un array puede convertirse implícitamente a un puntero a su primer elemento",
      "Los punteros son simplemente arrays con un solo elemento",
      "Los arrays son punteros a múltiples elementos"
    ],
    respuestaCorrecta: 1,
    explicacion: "En C++, un array puede convertirse implícitamente a un puntero a su primer elemento. Por esto es posible utilizar notación de punteros con arrays y viceversa en muchos contextos."
  },
  {
    pregunta: "¿Qué representa arr[i] en términos de aritmética de punteros?",
    opciones: [
      "*(arr + i)",
      "arr + i",
      "&(arr + i)",
      "arr * i"
    ],
    respuestaCorrecta: 0,
    explicacion: "arr[i] es equivalente a *(arr + i). Esto significa: 'desreferencia la dirección que resulta de sumar i veces el tamaño del tipo a la dirección base arr'."
  },
  {
    pregunta: "¿Cuál es la forma correcta de recorrer un array usando punteros?",
    opciones: [
      "for (int i = 0; i < size; i++) { *(arr[i]); }",
      "for (int i = 0; i < size; i++) { *(arr + i); }",
      "for (int *ptr = arr; ptr < arr + size; ptr++) { *ptr; }",
      "for (int *ptr = &arr; *ptr; ptr++) { *ptr; }"
    ],
    respuestaCorrecta: 2,
    explicacion: "La forma correcta es 'for (int *ptr = arr; ptr < arr + size; ptr++) { *ptr; }'. Inicializamos un puntero al inicio del array y lo incrementamos hasta que alcance el final del array."
  }
];

// Quiz sobre Gestión de Memoria
export const quizGestionMemoria = [
  {
    pregunta: "¿Qué operador se utiliza para asignar memoria dinámica para un solo objeto en C++?",
    opciones: [
      "malloc()",
      "alloc()",
      "new",
      "create()"
    ],
    respuestaCorrecta: 2,
    explicacion: "El operador 'new' se utiliza para asignar memoria dinámica para un solo objeto. Por ejemplo: 'int *p = new int;' asigna memoria para un entero."
  },
  {
    pregunta: "¿Qué operador se utiliza para liberar memoria asignada a un array dinámico?",
    opciones: [
      "delete",
      "delete[]",
      "free()",
      "release()"
    ],
    respuestaCorrecta: 1,
    explicacion: "El operador 'delete[]' se utiliza para liberar memoria asignada a un array. Es esencial usar delete[] para arrays y no delete, ya que este último solo liberaría el primer elemento."
  },
  {
    pregunta: "¿Qué problema ocurre cuando se libera memoria dos veces?",
    opciones: [
      "Memory leak (fuga de memoria)",
      "Stack overflow (desbordamiento de pila)",
      "Double free (doble liberación), que puede causar comportamiento indefinido",
      "Simplemente no tiene efecto"
    ],
    respuestaCorrecta: 2,
    explicacion: "Liberar memoria dos veces (double free) puede causar comportamiento indefinido, corrupción del heap y potencialmente fallos en el programa. Es un error grave de programación."
  },
  {
    pregunta: "¿Qué es un memory leak (fuga de memoria)?",
    opciones: [
      "Cuando un programa usa más memoria de la que tiene disponible",
      "Cuando la memoria asignada no se libera después de que ya no se necesita",
      "Cuando un puntero apunta a una dirección de memoria inválida",
      "Cuando dos punteros apuntan a la misma dirección de memoria"
    ],
    respuestaCorrecta: 1,
    explicacion: "Un memory leak ocurre cuando la memoria que ha sido asignada dinámicamente no se libera cuando ya no se necesita. Esto provoca que el programa consuma cada vez más memoria a lo largo del tiempo."
  }
];

// Quiz sobre Punteros a Funciones
export const quizPunterosFunciones = [
  {
    pregunta: "¿Qué es un puntero a función?",
    opciones: [
      "Una variable que almacena el nombre de una función",
      "Una variable que almacena la dirección de memoria de una función",
      "Una función que devuelve un puntero",
      "Un alias para una función existente"
    ],
    respuestaCorrecta: 1,
    explicacion: "Un puntero a función es una variable que almacena la dirección de memoria de una función, permitiendo llamar a la función indirectamente a través del puntero."
  },
  {
    pregunta: "¿Cuál es la sintaxis correcta para declarar un puntero a una función que toma un int y devuelve un double?",
    opciones: [
      "double (*ptr)(int);",
      "double *ptr(int);",
      "ptr<double>(int);",
      "function<double(int)> ptr;"
    ],
    respuestaCorrecta: 0,
    explicacion: "La sintaxis correcta es 'double (*ptr)(int);'. Los paréntesis alrededor de *ptr son necesarios para indicar que ptr es un puntero a función y no una función que devuelve un puntero."
  },
  {
    pregunta: "¿Cuál es una ventaja principal de los punteros a funciones?",
    opciones: [
      "Hacen que el código sea más rápido",
      "Reducen el tamaño del ejecutable",
      "Permiten seleccionar dinámicamente qué función usar en tiempo de ejecución",
      "Eliminan la necesidad de usar bucles"
    ],
    respuestaCorrecta: 2,
    explicacion: "Una ventaja principal de los punteros a funciones es que permiten seleccionar dinámicamente qué función ejecutar en tiempo de ejecución, lo que facilita implementar callbacks, plugins y patrones como strategy y command."
  }
];

// Quiz sobre Conceptos Avanzados de Punteros
export const quizConceptosAvanzados = [
  {
    pregunta: "¿Qué es un puntero a puntero?",
    opciones: [
      "Un puntero que no puede ser modificado",
      "Un puntero que almacena la dirección de otro puntero",
      "Un puntero que apunta a múltiples direcciones",
      "Una técnica para evitar fugas de memoria"
    ],
    respuestaCorrecta: 1,
    explicacion: "Un puntero a puntero es un puntero que almacena la dirección de memoria de otro puntero. Se declara con dos asteriscos: int **ptr;"
  },
  {
    pregunta: "¿Qué es el placement new en C++?",
    opciones: [
      "Una forma de asignar memoria en una posición específica ya asignada",
      "Una forma de crear objetos sin constructor",
      "Una técnica para reservar grandes bloques de memoria",
      "Un método para inicializar arreglos dinámicamente"
    ],
    respuestaCorrecta: 0,
    explicacion: "Placement new es una variante del operador new que permite construir un objeto en una ubicación de memoria previamente asignada. Es útil para sistemas con restricciones de memoria o pools de objetos."
  },
  {
    pregunta: "¿Qué son los punteros inteligentes en C++ moderno?",
    opciones: [
      "Punteros que pueden apuntar a cualquier tipo de dato",
      "Punteros optimizados que hacen que el código sea más rápido",
      "Clases que envuelven punteros crudos y gestionan automáticamente la memoria",
      "Punteros que pueden cambiar dinámicamente el tipo al que apuntan"
    ],
    respuestaCorrecta: 2,
    explicacion: "Los punteros inteligentes son clases que envuelven punteros crudos y gestionan automáticamente la memoria. Liberan los recursos cuando ya no se necesitan, ayudando a prevenir fugas de memoria y errores."
  },
  {
    pregunta: "¿Cuál de los siguientes NO es un tipo de puntero inteligente en C++ moderno?",
    opciones: [
      "std::unique_ptr",
      "std::shared_ptr",
      "std::weak_ptr",
      "std::auto_ptr"
    ],
    respuestaCorrecta: 3,
    explicacion: "std::auto_ptr fue deprecado en C++11 y eliminado en C++17. Los punteros inteligentes modernos son std::unique_ptr, std::shared_ptr y std::weak_ptr."
  },
  {
    pregunta: "¿Qué es la poligrafía de datos en C++?",
    opciones: [
      "Una técnica para comprimir datos en memoria",
      "La capacidad de un puntero para apuntar a diferentes tipos de datos",
      "Un método para reinterpretar la representación binaria de un tipo como otro",
      "Una forma de encriptar datos en memoria"
    ],
    respuestaCorrecta: 2,
    explicacion: "La poligrafía de datos (type punning) es una técnica que permite reinterpretar la representación binaria de un tipo como otro. Se realiza comúnmente usando punteros, como con reinterpret_cast o uniones."
  }
];

// Quiz sobre Patrones de Diseño con Punteros
export const quizPatronesDiseño = [
  {
    pregunta: "¿Qué patrón de diseño garantiza una única instancia de una clase y proporciona un punto de acceso global a ella?",
    opciones: [
      "Factory Method",
      "Singleton",
      "Observer",
      "Strategy"
    ],
    respuestaCorrecta: 1,
    explicacion: "El patrón Singleton garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella mediante un método estático que devuelve la única instancia."
  },
  {
    pregunta: "En el patrón Factory Method, ¿qué tipo de dato se suele utilizar para devolver las instancias creadas en C++?",
    opciones: [
      "Referencias a clases concretas",
      "Referencias a interfaces",
      "Punteros a la clase base",
      "Instancias estáticas"
    ],
    respuestaCorrecta: 2,
    explicacion: "En C++, el patrón Factory Method típicamente utiliza punteros a la clase base para devolver las instancias polimórficas creadas, permitiendo que el cliente trabaje con la abstracción en lugar de la implementación concreta."
  },
  {
    pregunta: "¿Qué problema específico de gestión de memoria puede ocurrir en la implementación tradicional del patrón Singleton en C++?",
    opciones: [
      "Fragmentación de la memoria",
      "Fuga de memoria al finalizar el programa",
      "Desalineación de memoria",
      "Saturación del stack"
    ],
    respuestaCorrecta: 1,
    explicacion: "La implementación tradicional del Singleton con un puntero estático que se inicializa bajo demanda puede causar una fuga de memoria si la instancia creada con 'new' nunca se destruye al finalizar el programa."
  },
  {
    pregunta: "En el patrón Observer en C++, ¿cómo se suelen mantener las referencias a los observadores?",
    opciones: [
      "Usando std::shared_ptr",
      "Mediante punteros crudos",
      "A través de referencias",
      "Con variables globales"
    ],
    respuestaCorrecta: 1,
    explicacion: "En implementaciones tradicionales de Observer en C++, se suelen usar punteros crudos para mantener las referencias a los observadores, lo que requiere una cuidadosa gestión manual de la memoria."
  },
  {
    pregunta: "¿Qué tipo de puntero inteligente es más adecuado para implementar el patrón Strategy en C++ moderno?",
    opciones: [
      "std::weak_ptr",
      "std::auto_ptr",
      "std::shared_ptr",
      "std::unique_ptr"
    ],
    respuestaCorrecta: 3,
    explicacion: "std::unique_ptr es el más adecuado para el patrón Strategy en C++ moderno, ya que representa correctamente la relación de propiedad exclusiva: el contexto es el único propietario de la estrategia."
  },
  {
    pregunta: "En el patrón Composite, ¿qué riesgo de memoria existe al implementarlo con punteros crudos?",
    opciones: [
      "Overflow del heap",
      "Fugas de memoria al eliminar la estructura",
      "Corrupción de punteros",
      "Acceso a memoria no inicializada"
    ],
    respuestaCorrecta: 1,
    explicacion: "Al implementar el patrón Composite con punteros crudos, existe el riesgo de fugas de memoria si no se liberan correctamente todos los componentes hijos al destruir un componente compuesto."
  },
  {
    pregunta: "¿Cuál es la principal diferencia en la implementación de patrones de diseño entre C++ y Java en términos de gestión de memoria?",
    opciones: [
      "C++ requiere tipos de datos más grandes",
      "Java no permite el uso de patrones de diseño complejos",
      "C++ necesita gestión manual de memoria mientras Java usa recolección de basura",
      "Los patrones en Java son más eficientes que en C++"
    ],
    respuestaCorrecta: 2,
    explicacion: "La principal diferencia es que en C++ el desarrollador debe gestionar explícitamente la memoria mediante punteros, mientras que en Java el recolector de basura se encarga automáticamente de la gestión de memoria."
  },
  {
    pregunta: "¿Qué ventaja tiene usar std::unique_ptr en lugar de punteros crudos al implementar el patrón Factory Method?",
    opciones: [
      "Mayor rendimiento en tiempo de ejecución",
      "Compatibilidad con lenguajes antiguos",
      "Gestión automática de la memoria y prevención de fugas",
      "Mejor interoperabilidad con bibliotecas externas"
    ],
    respuestaCorrecta: 2,
    explicacion: "Usar std::unique_ptr proporciona gestión automática de la memoria, asegurando que los objetos creados por la fábrica sean destruidos automáticamente cuando ya no se necesiten, evitando fugas de memoria."
  },
  {
    pregunta: "En el contexto de patrones de diseño en C++, ¿cuándo es más adecuado usar referencias en lugar de punteros?",
    opciones: [
      "Cuando se necesita polimorfismo",
      "Cuando el objeto no debe ser nulo y no cambia de propietario",
      "Cuando se requiere asignación dinámica de memoria",
      "Cuando se trabaja con colecciones de objetos"
    ],
    respuestaCorrecta: 1,
    explicacion: "Las referencias son más adecuadas cuando el objeto no debe ser nulo y no cambia de propietario durante su uso, lo que proporciona una interfaz más clara y segura que los punteros en estos casos."
  },
  {
    pregunta: "¿Qué patrón utiliza extensivamente punteros a funciones o functores en C++?",
    opciones: [
      "Singleton",
      "Composite",
      "Strategy",
      "Factory Method"
    ],
    respuestaCorrecta: 2,
    explicacion: "El patrón Strategy utiliza extensivamente punteros a funciones, functores o lambdas en C++ moderno, ya que su objetivo es encapsular algoritmos y hacerlos intercambiables en tiempo de ejecución."
  }
];

// Exportación conjunta de todos los quizzes
export const getAllQuizzes = () => {
  return {
    introduccion: quizIntroduccion,
    declaracion: quizDeclaracion,
    operaciones: quizOperaciones,
    arreglos: quizArreglos,
    gestion: quizGestionMemoria,
    funciones: quizPunterosFunciones,
    avanzados: quizConceptosAvanzados,
    patrones: quizPatronesDiseño
  };
}; 
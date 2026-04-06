"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

const sections = [
  {
    id: "estrategia",
    title: "1. Estrategia General",
    icon: "🎯",
    content: `**Tu Perfil:**
- Peso actual: ~100 kg
- Turno nocturno: 8 PM – 5 AM
- Sueño: 5:30/6 AM → 1/2 PM

**Ventana de comida:** 2:00 PM – 2:00 AM (12 horas)
**Ventana de ayuno:** 2:00 AM – 2:00 PM (12 horas)

**¿Por qué este horario?**
- Comes tu primera comida al despertar (2 PM)
- Comes durante el turno sin problemas
- La última comida entra antes de las 2 AM
- Ayunas mientras duermes (la parte más fácil)
- No luchas contra el hambre en horas activas

**Objetivo semanal realista:**
- Perder 0.5 – 0.8 kg por semana
- Eso es ~2-3 kg al mes
- En 6 meses: ~85 kg (meta alcanzable)

**Macros diarios simplificados:**
- Calorías: 1,800 – 2,000 kcal
- Proteína: 150 – 170g (prioridad #1)
- El resto rellénalo con carbohidratos y grasas sin pensarlo demasiado
- Regla simple: si tiene proteína y no es frito, probablemente está bien`,
  },
  {
    id: "horario",
    title: "2. Horario Diario Exacto",
    icon: "⏰",
    content: `**1:30 PM** — Alarma. Levantarte.
- Tomar 500ml de agua fría al despertar
- Café negro o té sin azúcar (opcional)
- Estiramiento rápido 2 minutos

**2:00 PM** — COMIDA 1 (la más grande)
- Proteína fuerte + carbohidrato + vegetales
- Ejemplo: pechuga + arroz + ensalada
- ~600 cal / ~45g proteína

**5:00 – 6:00 PM** — COMIDA 2
- Proteína + carbohidrato ligero
- Ejemplo: carne molida + papa + brócoli
- ~500 cal / ~40g proteína

**7:30 PM** — Prepararte para el turno
- Llevar comida 3 y snack preparados
- Botella de agua llena

**8:00 PM** — Inicio de turno

**9:00 – 10:00 PM** — COMIDA 3 (en el trabajo)
- Container de meal prep
- Ejemplo: pollo + arroz + vegetales
- ~500 cal / ~40g proteína

**12:00 – 1:00 AM** — COMIDA 4 / SNACK FINAL
- Proteína liviana
- Ejemplo: yogurt griego + fruta, o huevos + tostada
- ~300 cal / ~30g proteína

**2:00 AM** — AYUNO EMPIEZA
- Solo agua, café negro, té sin azúcar
- Zero calorías hasta las 2 PM

**5:00 – 5:30 AM** — Llegar a casa
- Registrar el día en GIEM
- Solo agua si tienes hambre

**6:00 AM** — Dormir

**Qué puedes tomar durante el ayuno:**
- Agua (toda la que quieras)
- Café negro (sin azúcar, sin leche)
- Té sin azúcar
- Agua con gas
- Electrolitos sin calorías
- NADA con calorías`,
  },
  {
    id: "plan-semanal",
    title: "3. Plan Semanal de Comidas",
    icon: "📋",
    content: `**LUNES**
- C1: Pechuga air fryer + arroz + ensalada
- C2: Carne molida + papa al horno + brócoli
- C3: Container pollo + arroz + vegetales mixtos
- C4: Yogurt griego + banana + granola

**MARTES**
- C1: Huevos revueltos (4) + tortilla + aguacate
- C2: Pechuga + pasta integral + espinaca
- C3: Container carne molida + arroz + frijoles
- C4: Shake proteína + fruta

**MIÉRCOLES**
- C1: Pechuga air fryer + papa + ensalada
- C2: Atún + arroz + vegetales
- C3: Container pollo + frijoles + arroz
- C4: Yogurt griego + almendras + miel

**JUEVES**
- C1: Omelette (4 huevos) + pan integral + aguacate
- C2: Carne molida + papa + brócoli
- C3: Container pechuga + arroz + ensalada
- C4: Shake proteína + banana

**VIERNES**
- C1: Pechuga air fryer + arroz + ensalada
- C2: Pollo desmenuzado + tortillas + pico de gallo
- C3: Container carne + papa + vegetales
- C4: Yogurt griego + fruta

**SÁBADO**
- C1: Huevos revueltos + frijoles + tortilla + aguacate
- C2: Pechuga + pasta + espinaca
- C3: Container pollo + arroz + brócoli
- C4: Snack libre (controlado, ~300 cal)

**DOMINGO** (día de meal prep)
- C1: Brunch libre (pero con proteína)
- C2: Carne molida + arroz + frijoles
- C3: Sobras del meal prep
- C4: Yogurt + fruta

**Patrón:** Las comidas se repiten mucho a propósito. Menos decisiones = más consistencia.`,
  },
  {
    id: "meal-prep",
    title: "4. Meal Prep Semanal",
    icon: "📦",
    content: `**DÍA DE PREP: Domingo (o tu día libre)**
Tiempo total: ~2 horas

**LISTA DE COCCIÓN:**

🐔 **Pollo (pechuga):**
- Comprar: 2.5 kg
- Sazonar con sal, pimienta, ajo en polvo, paprika
- Cocinar en air fryer o al horno
- Dividir en 8 porciones (~150g cada una)

🥩 **Carne molida (90/10 o 93/7):**
- Comprar: 1.5 kg
- Cocinar con cebolla, ajo, sal, comino
- Dividir en 5 porciones (~150g)

🍚 **Arroz:**
- Cocinar: 1.5 kg (en seco, rinde ~4 kg cocido)
- Dividir en 8-10 porciones (~200g cocido)

🥔 **Papas:**
- Comprar: 1.5 kg
- Cortar en cubos, air fryer con spray de aceite
- Dividir en 5 porciones

🥚 **Huevos:**
- Hervir: 12 huevos
- Guardar con cáscara en refrigerador
- Duran 7 días

🥦 **Vegetales:**
- Brócoli: 2 cabezas, cortar y blanquear
- Espinaca: 2 bolsas (se usa fresca)
- Ensalada pre-mezclada: 2 bolsas

**CONTAINERS NECESARIOS: 8 mínimo**

**Distribución:**
- 4 containers: Pollo + arroz + vegetales
- 3 containers: Carne molida + papa o arroz + vegetales
- 1 container: Arroz extra

**Refrigerador (consumir en 4 días):**
- Containers 1-4
- Huevos hervidos
- Vegetales frescos

**Congelador (para día 5-7):**
- Containers 5-7
- Sacar la noche anterior al refrigerador para descongelar`,
  },
  {
    id: "cocina",
    title: "5. Instrucciones de Cocina",
    icon: "🍳",
    content: `**PECHUGA DE POLLO EN AIR FRYER**
1. Sazonar con sal, pimienta, ajo en polvo, paprika
2. Spray de aceite por ambos lados
3. Air fryer: 200°C (400°F) por 10 min, voltear, 8 min más
4. Dejar reposar 3 minutos antes de cortar
5. Punto: que no esté rosa por dentro

**PAPAS EN AIR FRYER**
1. Cortar en cubos de 2 cm
2. Mezclar con spray de aceite + sal + pimienta + paprika
3. Air fryer: 200°C (400°F) por 15-18 min, agitar a la mitad
4. Quedan crujientes por fuera, suaves por dentro

**ARROZ PERFECTO**
1. Lavar el arroz 2-3 veces hasta que el agua salga clara
2. Proporción: 1 taza arroz → 2 tazas agua
3. Hervir, bajar a fuego mínimo, tapar, 18 minutos
4. NO destapar durante la cocción
5. Apagar y dejar reposar 5 min tapado

**RECALENTAR ARROZ SIN DAÑARLO:**
- Agregar 1 cucharada de agua al container
- Microondas 1.5 min con tapa semi-abierta
- Revolver y listo

**HUEVOS HERVIDOS PERFECTOS**
1. Agua hirviendo → meter huevos con cuchara
2. 10 minutos para huevo duro
3. Sacar y meter en agua con hielo 5 min
4. Pelan fácil y quedan perfectos

**CARNE MOLIDA RÁPIDA**
1. Sartén a fuego alto con spray de aceite
2. Carne molida + cebolla picada
3. Romper con cuchara de madera
4. Agregar: sal, pimienta, comino, ajo en polvo
5. Cocinar 8-10 min hasta que no esté rosa
6. Escurrir grasa si es necesario

**ENSALADA RÁPIDA (2 min)**
1. Bolsa de ensalada pre-mezclada en bowl
2. Tomate cherry cortado a la mitad
3. Pepino en rodajas
4. Chorro de limón + sal + aceite de oliva
5. Listo

**YOGURT BOWL**
1. Yogurt griego natural (200g)
2. Banana en rodajas o fresas
3. Granola (30g) o almendras
4. Miel (1 cucharadita, opcional)
- ~300 cal / ~25g proteína`,
  },
  {
    id: "compras",
    title: "6. Lista de Compras",
    icon: "🛒",
    content: `**PROTEÍNA** 🥩
- Pechuga de pollo (2.5 kg) ← BULK en Sam's
- Carne molida 90/10 (1.5 kg)
- Huevos (30 unidades) ← BULK
- Yogurt griego natural (pack grande)
- Atún en agua (6 latas)
- Proteína en polvo whey (opcional)

**VEGETALES** 🥦
- Brócoli (2 cabezas)
- Espinaca (2 bolsas)
- Ensalada pre-mezclada (2 bolsas)
- Tomate cherry (1 caja)
- Pepino (3-4)
- Cebolla (3-4)
- Ajo (1 cabeza)
- Aguacate (4-5)

**FRUTAS** 🍌
- Bananas (racimo)
- Fresas o blueberries
- Limones (bolsa)

**CARBOHIDRATOS** 🍚
- Arroz blanco o integral (2 kg) ← BULK
- Papas (1.5 kg)
- Pan integral
- Tortillas integrales
- Pasta integral (500g)
- Frijoles enlatados (4 latas)
- Avena (opcional)

**GRASAS SALUDABLES** 🥑
- Aceite de oliva
- Spray de aceite (para air fryer)
- Almendras o nueces (bolsa)
- Mantequilla de maní natural

**BEBIDAS** 💧
- Agua embotellada (o filtro)
- Café (grano o molido)
- Té sin azúcar
- Agua con gas (para antojos)

**CONDIMENTOS** 🧂
- Sal
- Pimienta
- Ajo en polvo
- Paprika / pimentón
- Comino
- Salsa soya baja en sodio
- Mostaza
- Salsa picante

**EXTRAS ÚTILES**
- Containers de meal prep (8-10)
- Bolsas ziploc
- Papel aluminio
- Granola (baja en azúcar)
- Miel
- Stevia o endulzante zero (si necesitas)

**COMPRAR EN BULK (Sam's Club):**
- Pollo, huevos, arroz, yogurt griego, agua, avena`,
  },
  {
    id: "almacenamiento",
    title: "7. Sistema de Almacenamiento",
    icon: "🧊",
    content: `**REFRIGERADOR (2-4°C):**
| Alimento | Duración máxima |
|----------|----------------|
| Pollo cocido | 4 días |
| Carne molida cocida | 4 días |
| Arroz cocido | 4 días |
| Huevos hervidos (con cáscara) | 7 días |
| Vegetales cocidos | 3-4 días |
| Ensalada fresca | 2-3 días |
| Yogurt abierto | 5 días |

**CONGELADOR (-18°C):**
| Alimento | Duración máxima |
|----------|----------------|
| Pollo cocido | 3 meses |
| Carne molida cocida | 3 meses |
| Arroz cocido | 1 mes |
| Containers completos | 2-3 meses |

**¿El arroz se puede congelar?**
SÍ. Congélalo en porciones individuales. Al recalentar, agrega 1 cucharada de agua y microondas 2 min.

**CÓMO ETIQUETAR:**
- Usa masking tape + marcador
- Escribe: contenido + fecha de preparación
- Ejemplo: "Pollo + arroz — Dom 6 Abr"

**CÓMO DESCONGELAR:**
- MEJOR: Pasar del congelador al refrigerador la noche anterior
- RÁPIDO: Microondas en modo defrost 3-4 min
- NUNCA dejar a temperatura ambiente por más de 2 horas

**CÓMO RECALENTAR:**
- Microondas: 2-3 min con tapa semi-abierta
- Agregar 1 cucharada de agua para que no se seque
- Revolver a la mitad del tiempo
- Air fryer: 180°C por 5 min (queda mejor el pollo)`,
  },
  {
    id: "ansiedad",
    title: "8. Plan Anti-Ansiedad",
    icon: "🧠",
    content: `**HAMBRE EN AYUNO:**
1. Tomar 500ml de agua fría (el hambre suele ser sed)
2. Café negro (suprime apetito naturalmente)
3. Mantenerte ocupado — el hambre pasa en 15-20 min
4. Recordar: "No estoy muriendo, estoy quemando grasa"
5. Si es insoportable: agua con gas + limón

**ANSIEDAD POR DULCE:**
1. Yogurt griego + miel + fruta (DENTRO de ventana)
2. Café con stevia
3. Chicle sin azúcar
4. Banana congelada (sabe a helado)
5. Regla: si el antojo dura menos de 10 min, es falso

**CANSANCIO EN TURNO:**
1. Café negro al inicio del turno (8-9 PM)
2. NO tomar café después de 12 AM (arruina tu sueño)
3. Comer comida 3 a tiempo (9-10 PM)
4. Caminar 5 minutos cada hora si puedes
5. Agua fría en la cara si estás muy cansado

**GANAS DE COMER POR ABURRIMIENTO (madrugada):**
1. Tomar agua con gas
2. Café descafeinado
3. Caminar o estirarte
4. Si ya comiste comida 4: NO comer más
5. Pensar: "¿Tengo hambre real o estoy aburrido?"

**SI TE SALES DEL PLAN UN DÍA:**
1. NO dramatizar. Un día no arruina nada.
2. NO compensar comiendo menos al día siguiente
3. NO hacer ayuno extra "de castigo"
4. Simplemente VOLVER al plan en la siguiente comida
5. Registrar el día honestamente en GIEM
6. Recordar: consistencia del 80% > perfección del 100%

**Frase clave:** "No necesito ser perfecto, necesito ser consistente."`,
  },
  {
    id: "emergencia",
    title: "9. Menú de Emergencia",
    icon: "🚨",
    content: `**Cuando NO cocinaste y necesitas comer:**

**WALMART / SUPERMERCADO:**
- Pollo rostizado ($5-7) + ensalada de bolsa
- Lata de atún + galletas integrales
- Yogurt griego + banana
- Huevos duros pre-cocidos + pan integral
- Deli: pechuga rebanada + queso + pan

**COMIDA RÁPIDA (menos mala):**
- Subway: pollo a la parrilla, mucha proteína, sin salsas cremosas
- Chipotle: bowl de pollo, arroz, frijoles, sin crema, sin queso
- McDonald's: McPollo sin mayo + ensalada lateral (no papas)
- Chick-fil-A: nuggets grilled + ensalada
- Cualquier lugar: pedir SIN salsas cremosas, SIN pan extra, DOBLE proteína

**GASOLINERA / TIENDA:**
- Beef jerky + agua
- Almendras + banana
- Huevos duros empacados
- Yogurt griego individual
- Queso string + manzana

**REGLAS DE EMERGENCIA:**
1. Siempre priorizar proteína
2. Evitar frituras y salsas cremosas
3. Agua en vez de refresco SIEMPRE
4. Mejor comer algo imperfecto que no comer
5. Registrar en GIEM lo que comiste (aunque sea estimado)`,
  },
  {
    id: "checklist",
    title: "10. Checklist Diario",
    icon: "✅",
    content: `**Tu sistema operativo diario — revisa antes de dormir:**

☐ Tomé 2+ litros de agua
☐ Cumplí mi ventana de proteína (150g+)
☐ Respeté el ayuno (0 calorías en ventana)
☐ Comí mis 4 comidas preparadas
☐ Cero refrescos / jugos / azúcar líquida
☐ Registré mi peso (si toca)
☐ Containers listos para mañana
☐ Hice algún movimiento / ejercicio
☐ Registré todo en GIEM

**BONUS (no obligatorio):**
☐ Caminé 20+ min
☐ Dormí 7+ horas
☐ No comí por aburrimiento
☐ Tomé suplementos (si aplica)

**Cómo funciona tu score de disciplina:**
- Ayuno completo: +30 pts
- 4/4 comidas registradas: +30 pts
- Ejercicio: +20 pts
- Peso registrado: +20 pts
- Meta: 70+ puntos diarios = semana exitosa`,
  },
  {
    id: "reglas",
    title: "11. Reglas del Sistema",
    icon: "⚡",
    content: `**LAS 10 REGLAS DE GIEM:**

**1.** Si dudo, como proteína + vegetales.

**2.** No tomo calorías. Solo agua, café negro, té.

**3.** No rompo el ayuno por antojo. El hambre pasa.

**4.** Cocino 2 veces por semana máximo. Meal prep es ley.

**5.** Registro TODO en GIEM. Lo que no se mide no se mejora.

**6.** Un día malo no arruina la semana. Vuelvo al plan.

**7.** Proteína primero, siempre. Mínimo 150g al día.

**8.** Llevo mi comida al trabajo. Si no llevo, fallo.

**9.** Me peso 2-3 veces por semana, NO todos los días. El peso fluctúa.

**10.** Consistencia > perfección. 80% de adherencia = resultados reales.

**BONUS: La regla de los 2 días**
Nunca falles 2 días seguidos. Un día malo pasa. Dos días seguidos es un patrón. Si fallas hoy, mañana es perfecto obligatoriamente.`,
  },
];

export default function GuidePage() {
  const [open, setOpen] = useState<string | null>("estrategia");

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-3">
      <h1 className="text-xl font-bold">Guía GIEM</h1>
      <p className="text-gray-400 text-xs">Tu plan completo de cut personalizado</p>

      {sections.map((s) => (
        <div key={s.id} className="card">
          <button
            onClick={() => setOpen(open === s.id ? null : s.id)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium text-sm">
              {s.icon} {s.title}
            </span>
            <span className="text-gray-400 text-lg">
              {open === s.id ? "−" : "+"}
            </span>
          </button>
          {open === s.id && (
            <div className="mt-3 text-sm text-gray-300 leading-relaxed whitespace-pre-line border-t border-dark-700 pt-3">
              {s.content.split("\n").map((line, i) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return (
                    <p key={i} className="font-bold text-white mt-3 mb-1">
                      {line.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                if (line.startsWith("**") && line.includes("**")) {
                  const parts = line.split("**");
                  return (
                    <p key={i} className="mt-2">
                      {parts.map((p, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="text-white">{p}</strong>
                        ) : (
                          <span key={j}>{p}</span>
                        )
                      )}
                    </p>
                  );
                }
                if (line.startsWith("- ") || line.startsWith("☐ ")) {
                  return (
                    <p key={i} className="ml-2 mt-0.5">
                      {line}
                    </p>
                  );
                }
                if (line.startsWith("|")) return null;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="mt-1">{line}</p>;
              })}
            </div>
          )}
        </div>
      ))}

      <Nav />
    </div>
  );
}

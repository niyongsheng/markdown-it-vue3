export default `
# markdown-it-vue3

## Image size and Viewer

![img_1](https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg =60x45)
![img_2](https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg =120x)

## GitHub Table of Contents

[toc]

Note: Only \`h2\` and \`h3\` are shown in toc.

## alter

Markup is similar to fenced code blocks. Valid container types are \`success\`, \`info\`, \`warning\` and \`error\`.

::: success
You have got it.
:::

::: info
You have new mail.
:::

::: warning
You have new mail.
:::

::: error
Staying up all night is bad for health.
:::

## mermaid charts

### mermaid Flowchart

[Flowchart Syntax](http://knsv.github.io/mermaid/#flowcharts-basic-syntax)

\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`

\`\`\`
sequenceDiagram
    participant Alice
    participant Bob
    Alice->John: Hello John, how are you?
    loop Healthcheck
        John->John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->Alice: Great!
    John->Bob: How about you?
    Bob-->John: Jolly good!
\`\`\`

## Definition list

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b
  
## list (nested)

- **Sample Node 1**
    - Sub-item 1.1 (Text1...)
    - Sub-item 1.2 (Text2......)
    - Sub-item 1.3 (Text3.........)
    
* **Sample Node 2**
    - \`node content\`

[Definition List Syntax](http://pandoc.org/README.html#definition-lists)

## table

| First Header  | Second Header | Third Header |
| ------------- | ------------- | ------------- |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |
| Content Cell  | Content Cell  | Content Cell |

## AsciiMath

Inline AsciiMath: \`@(1/2[1-(1/2)^n])/(1-(1/2))=s_n@\`

\`\`\`AsciiMath
oint_Cx^3 dx+4y^2 dy

2=(((3-x)xx2)/(3-x))

sum_(m=1)^oosum_(n=1)^oo(m^2 n)/(3^m(m3^n+n3^m)
\`\`\`

\`\`\`ASCIIMath
phi_n(kappa) = 1/(4pi^2 kappa^2)
 int_0^oo (sin(kappa R))/(kappa R)
 del/(del R)
[R^2 (del D_n (R))/(del R)] del R
\`\`\`

[AsciiMath Documentation](http://asciimath.org/)

## Subscript: H~2~O

You can also use inline math: \`$H_2O$\`


## Superscript: 29^th^

You can also use inline math: \`$29^{th}$\`


## Emoji: :panda_face: :sparkles: :camel: :boom: :pig:

[Emoji Cheat Sheet](http://www.emoji-cheat-sheet.com/)

## Fontawesome: :fa-car: :fa-flag: :fa-bicycle: :fa-leaf: :fa-heart:

[All the Font Awesome icons](http://fontawesome.io/icons/)

## Echarts

[Documentation for Echarts](http://echarts.baidu.com)

The width and height is the size for chart container.

\`\`\`echarts
{
  "width": 500,
  "height": 400,
  "animation": false,
  "title": {
    "text": "Quarterly Revenue & Expenses",
    "left": "center"
  },
  "legend": {
    "data": ["Revenue", "Expenses"],
    "top": 30
  },
  "grid": {
    "bottom": 40
  },
  "xAxis": {
    "type": "category",
    "name": "Quarter",
    "data": ["Q1", "Q2", "Q3", "Q4"]
  },
  "yAxis": {
    "type": "value",
    "name": "Amount ($K)"
  },
  "series": [
    {
      "name": "Revenue",
      "type": "line",
      "data": [500, 700, 900, 1200]
    },
    {
      "name": "Expenses",
      "type": "line",
      "data": [400, 600, 800, 1000]
    }
  ]
}
\`\`\`

\`\`\`echarts
{
  "width": 500,
  "height": 400,
  "animation": false,
  "title": {
    "text": "Traffic Sources",
    "left": "center"
  },
  "legend": {
    "show": false,
    "bottom": 40,
    "left": "center"
  },
  "tooltip": {
    "trigger": "item",
    "formatter": "{a} <br/>{b}: {c} ({d}%)"
  },
  "series": [
    {
      "name": "Traffic Source",
      "type": "pie",
      "radius": ["40%", "70%"],
      "center": ["50%", "45%"],
      "data": [
        {"value": 235, "name": "Video Ads"},
        {"value": 274, "name": "Affiliate"},
        {"value": 310, "name": "Email Marketing"},
        {"value": 335, "name": "Direct Access"},
        {"value": 400, "name": "Search Engine"}
      ]
    }
  ]
}
\`\`\`

\`\`\`echarts
{
  "width": 600,
  "height": 400,
  "animation": true,
  "title": {
    "text": "Product Sales (Stacked)",
    "left": "center",
    "top": 10,
    "textStyle": {
      "fontSize": 16,
      "fontWeight": "bold"
    }
  },
  "legend": {
    "show": false,
    "data": ["A", "B", "C", "D"],
    "top": "bottom",
    "itemWidth": 12,
    "itemHeight": 12
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    },
    "backgroundColor": "rgba(50,50,50,0.7)",
    "borderColor": "#fff",
    "borderWidth": 1,
    "textStyle": {
      "color": "#fff"
    }
  },
  "xAxis": {
    "type": "category",
    "name": "Product",
    "nameLocation": "middle",
    "nameGap": 30,
    "data": ["Product 1", "Product 2", "Product 3", "Product 4"],
    "axisLabel": {
      "interval": 0
    }
  },
  "yAxis": {
    "type": "value",
    "name": "Sales",
    "nameLocation": "middle",
    "nameGap": 40
  },
  "series": [
    {
      "name": "A",
      "type": "bar",
      "stack": "total",
      "data": [120, 132, 101, 134],
      "itemStyle": {
        "borderRadius": [4, 4, 0, 0]
      }
    },
    {
      "name": "B",
      "type": "bar",
      "stack": "total",
      "data": [220, 182, 191, 234],
      "itemStyle": {
        "borderRadius": [4, 4, 0, 0]
      }
    },
    {
      "name": "C",
      "type": "bar",
      "stack": "total",
      "data": [150, 232, 201, 154],
      "itemStyle": {
        "borderRadius": [4, 4, 0, 0]
      }
    },
    {
      "name": "D",
      "type": "bar",
      "stack": "total",
      "data": [90, 272, 81, 120],
      "itemStyle": {
        "borderRadius": [4, 4, 0, 0]
      }
    }
  ]
}
\`\`\`

\`\`\`echarts
{
  "width": 500,
  "height": 400,
  "animation": false,
  "title": {
    "text": "Performance Radar",
    "left": "center"
  },
  "legend": {
    "data": ["Budget", "Actual"],
    "bottom": 0
  },
  "tooltip": {
    "trigger": "item"
  },
  "radar": {
    "indicator": [
      {"name": "Sales", "max": 6500},
      {"name": "Management", "max": 16000},
      {"name": "IT", "max": 30000},
      {"name": "Support", "max": 38000},
      {"name": "R&D", "max": 52000},
      {"name": "Marketing", "max": 25000}
    ],
    "center": ["50%", "45%"],
    "radius": "60%"
  },
  "series": [
    {
      "name": "Budget vs Actual",
      "type": "radar",
      "data": [
        {
          "value": [4200, 3000, 20000, 35000, 50000, 18000],
          "name": "Budget"
        },
        {
          "value": [5000, 14000, 28000, 26000, 42000, 21000],
          "name": "Actual"
        }
      ]
    }
  ]
}
\`\`\`

## code

### c
\`\`\`c
#include <stdio.h>
int main(int argc char* argv[]) {
  printf("Hello, World!");
  return 0;
}
\`\`\`

### json

\`\`\`json
{
  "name": "markdown-it-vue3"
}
\`\`\`

### javascript
\`\`\`json
import MarkdownItVue3 from 'markdown-it-vue3'
export default {
  components: {
    MarkdownItVue
  }
}
\`\`\`

### bash
\`\`\`bash
npm install markdown-it-vue3
\`\`\`

## flowchart.js

\`\`\`flowchart.js
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End:>http://www.google.com
op1=>operation: My Operation|past
op2=>operation: Stuff|current
sub1=>subroutine: My Subroutine|invalid
cond=>condition: Yes
or No?|approved:>http://www.google.com
c2=>condition: Good idea|rejected
io=>inputoutput: catch something...|request
para=>parallel: parallel tasks

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->para
c2(true)->io->e
c2(false)->e

para(path1, bottom)->sub1(left)->op1
para(path2, right)->op2->e

st@>op1({"stroke":"Red"})@>cond({"stroke":"Red","stroke-width":6,"arrow-end":"classic-wide-long"})@>c2({"stroke":"Red"})@>op2({"stroke":"Red"})@>e({"stroke":"Red"})
\`\`\`

`

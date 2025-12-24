Os componentes screen são os componentes que são renderizados na tela.
Geralmente são feitos com functions, e não por classes. E também foram criados para o componente principal da tela específica não ficar tão extenso, e ficar mais organizado. O momento que você percebe que deve criar um componente screen eh quando aquele componente ESPECÍFICO daquela tela fica extenso e complexo demais para estar no componente principal da tela específica.

Eles ficam na pasta `components/component_screens` e são referenciados no componente principal da tela específica.

Dentro dessa pasta você verá que terá uma pasta para cada tela específica, como por exemplo: 'home_screen'. O padrão de nome dessa pasta é esse: "{nome_da_tela}_screen".

Então por exemplo a home screen tem vários componentes específicos complexos com diversos states e props, e esses componentes são referenciados no componente principal da home screen. Mas são armazenados em `components/component_screens/home_screen` e são referenciados no componente principal da home screen.	


o padrão do nome do componente screen é esse: "{nome_da_tela}-screen.tsxt".
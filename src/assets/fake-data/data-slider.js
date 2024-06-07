import bgImg1 from '../images/background/bg-1.jpg';
import bgImg2 from '../images/background/bg-3.jpg';
import bgImg3 from '../images/background/bg-4.jpg';
import img1 from '../images/common/itemslider.png';

const dataSlider = [
    {
        id: 1,
        title: 'The Future of Web Development with Three.js & React',
        desc : 'We sculpt interactive web experiences that captivate and redefine user engagement.',
        bgImg: bgImg1,
        img : img1,
        titleStyle: { 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
            WebkitTextStroke: '100px black', // Adding black outline
            color: 'white' // Ensuring the text color is visible with the outline
        }
    },
    {
        id: 2,
        title: 'CYbox nft collectionS for everyone',
        desc : 'Nulla ornare sagittis placerat nunc sit tempus enim. Accumsan pellentesque ipsum felis tristique at proin vel turpis.',
        bgImg: bgImg2,
        classAction: 'two'
    },
    {
        id: 3,
        title: 'The Future of Web Development',
        desc : 'We sculpt interactive web experiences that captivate and redefine user engagement. Specialized Services with Three.js & React.',
        bgImg: bgImg3,
        classAction: 'three',
        titleStyle: { 
            textShadow: '20px 20px 40px rgba(0, 0, 0, 0.5)', 
            WebkitTextStroke: '100px black', // Adding black outline
            color: 'white' // Ensuring the text color is visible with the outline
        }
    },
    {
        id: 4,
        title: 'CYbox nft collectionS for everyone',
        desc : 'Nulla ornare sagittis placerat nunc sit tempus enim. Accumsan pellentesque ipsum felis tristique at proin vel turpis.',
        bgImg: bgImg1,
        img : img1
    },
    {
        id: 5,
        title: 'CYbox nft collectionS for everyone',
        desc : 'Nulla ornare sagittis placerat nunc sit tempus enim. Accumsan pellentesque ipsum felis tristique at proin vel turpis.',
        bgImg: bgImg2,
        classAction: 'two'
    },

]

export default dataSlider;
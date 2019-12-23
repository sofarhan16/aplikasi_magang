import React, { Component } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';
import axios from 'axios';
import { KONEKSI } from '../../src/support/config/index';
const items = [
  {
    src: './image/japan.jpeg',
  },
  {
    src: './image/china.jpeg',
  },
  {
    src: './image/malaysia.jpg',
  },
  {
    src: './image/malaysia.jpg',
  },
  {
    src: './image/malaysia.jpg',
  },
  {
    src: './image/malaysia.jpg',
  },
  // {
  //   src: 'https://via.placeholder.com/1400x460/',
  //   altText: 'Anton Tanjung',
  //   caption: 'Resep Sehat & Bahagia'
  // },
  // {
  //   src: 'https://via.placeholder.com/1400x460/',
  //   altText: 'Buku K-Pop',
  //   caption: 'Diskon Buku K-Pop'
  // }
];

class CarouselKu extends Component {
 
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0,carousell1:'',
    carousell2:'',
    carousell3:'',
    carousell:[]};
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }
  componentDidMount(){
    axios.get(`${KONEKSI}/product/getcarousell`)
    .then((res) => {
        console.log(res.data);
        this.setState({carousell:res.data,
            carousell1:res.data[0].gambar,
            carousell2:res.data[0].gambar2,
            carousell3:res.data[0].gambar3,
           
        })
    }).catch((err) => {
        console.log(err)
    })
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex, carousell} = this.state;

    const slides = carousell.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
          
        >
         
                {/* <CarouselCaption captionText={item.altText} captionHeader={item.caption} className=' custom-caption' tag='div'/> */}
            
              <img src={`${KONEKSI}/${item.gambar}`} alt={item.altText}/>
          
        </CarouselItem>
      );
    });

    return (
      <div>
      <style>
      {
        `.custom-tag {
            height: 500px;
            background: #e3f4fb;
          }
          .custom-caption{
            color:black;
          }
          .custom-position{
            position: absolute;
            left: 50%;
            top: 50%;
          }
          .gambar{
            max-height='500px'
          }`
      }
    </style>
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
        
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
      </Carousel>
      </div>
    );
  }
}


export default CarouselKu;
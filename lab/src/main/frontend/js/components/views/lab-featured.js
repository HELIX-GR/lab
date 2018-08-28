import * as React from 'react';
import { Courses } from './landing/courses';


import {
  FormattedMessage,
} from 'react-intl';

const cardInfo = [
  {
    title: <FormattedMessage id="featured.first.title" defaultMessage="What is HELIX Lab?" />,
    description: <FormattedMessage id="featured.first.description" defaultMessage="It’s your own private data infrastructure for learning, sharing, and building with data. You can bring your own data or use our open scientific data, interactively code in your language of choice, experiment over dedicated Big Data clusters or our HPC, and share your work with others. " />,
    link: {
      ref: "",
      text: <FormattedMessage id="featured.first.text" defaultMessage="Learn more about Lab and how to use it." />,
    },
  },
  {
    title: <FormattedMessage id="featured.second.title" defaultMessage="Academic Support" />,
    description: <FormattedMessage id="featured.second.description" defaultMessage="Integrate Lab in your official undergraduate, postgraduate or seminar curricula. Organize courses with your own data, exercises, and tests.  Your students can learn about statistics, data management, and machine learning. No infrastructure, installation, or setup costs! " />,
    link: {
      ref: "",
      text: <FormattedMessage id="featured.second.text" defaultMessage="See the list of courses." />,
    },
  }
];

const CoursesCardInfo = [
  {
    title: "Notebook Repository",
    description: "Find interesting notebooks created and shared by others, copy them in your own space, and use them anyway you want. Also, why don’t you also share your work with others?",
    image: "images/code.svg",
    link: {
      ref: "#",
      text: "See all public notebooks",
    },
  },
  {
    title: "Learn Jupyter",
    description:"Whether you are a novice, or an expert notebook user, start here. We have assembled a collection of educational resources, guides, examples and online courses to help you start using Jupyter in your own research." ,
    image: "images/jupyter.svg",
    link: {
      ref: "#",
      text: "Start learning" ,
    },
  },
  {
    title: "Tips for Data Visualization",
    description: "Your data is only as good as your ability to understand and communicate it, which is why choosing the right visualization/ chart is essential",
    image: "images/data_vis.png",
    link: {
      ref: "#",
      text: "Take me to blog post",
    },
  },
  {
    title: "Featured notebooks",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "images/online_courses.svg",
    link: {
      ref: "#",
      text: "Take me there!",
    },
  },
  
];


class LabFeatured extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="lab-landing-page-content">

        <div className="featured-lab-container container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="main-lab-item">

                <h2 className="main-lab-item-title">
                A Data Science Laboratory in your browser
                  
                </h2>

                <div className="main-lab-item-subtitle">
                Create and share notebooks with live interactive code and visualizations over scientific data and large-scale computing infrastructures within your browser.
                </div>

              </div>
            </div>
            {cardInfo.map((r, key) => (
              <div className="col-md-3 col-sm-6 col-xs-12" key={key}>
                <div className="lab-item">
                  <h3 className="lab-title">
                    <a href="#"> {r.title} </a>
                  </h3>
                  <div className="lab-description">
                    {r.description}
                  </div>
                  <div className='lab-action-link'>
                    <a href={r.link.ref}> {r.link.text} </a>
                  </div>
                </div>
              </div>)
            )}
          </div>
        </div>
        <Courses info={CoursesCardInfo} />

      </section>
    );
  }
}

export default LabFeatured;

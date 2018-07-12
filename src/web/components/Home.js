import React from 'react';
import { Row, Col, Jumbotron } from 'reactstrap';

const About = () => (
  <div>
    <Row>
      <Jumbotron className="bg-primary text-white">
        <h1>Tomato Recipe App</h1>
        <p className="lead">For when you're looking to build 'the next big meal', but don't want to start from scratch.</p>
        <p>Tomato is your smart cooking sidekick, offering personalized guidance every step of the way. From recipe recommendations just for you, to handy tools and helpful videos, Tomato has everything you need to improve life in the kitchen. Experience what millions are enjoying on the web, free on your Android device.</p>
      </Jumbotron>
    </Row>
    <hr />
    <Row className="pt-5">
      <Col xs="5" sm="3" lg="2" className="offset-lg-2">
        <img className="img-fluid rounded-circle" src="http://sv1.upsieutoc.com/2018/07/08/Logo.png"/>
      </Col>
      <Col xs="12" sm="9" lg="5" className="pt-4 pt-sm-0">
        <h3>I can help</h3>
        <p>Let Tomato be your guide, with NEW step-by-step Guided Recipes, including video tutorials, oven timers, and more handy tools to make cooking a breeze.</p>
      </Col>
    </Row>
  </div>
);

export default About;

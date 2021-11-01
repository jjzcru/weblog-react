import React from "react";
import styles from "./home.module.css";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Home() {
    return (
        <div className={styles.home}>
            <div>
                <ul>
                    <span className={styles["weblog-nav"]}>We<span className={styles.bold}>Blog</span></span>
                    <li><a href="/">Home</a></li>
                    <li><a href="/login">Log In</a></li>
                    <li><a href="/signup">Sign Up</a></li>
                    <li><a href="/categories">Categories</a></li>
                </ul>
            </div>
            <div className={styles.centered}>
                <h1>We blog so we can connect</h1>
                <h2>Share with the Stevens community. Learn from your peers.</h2>
                <br />
                <Link to="/signup" className={styles["button-link"]}>
                    <button className={styles.button}>Get Started</button>
                </Link>
                <br />
            </div>
            <div className={styles.box1}>
                <Container>
                    <Row className="align-items-center">
                        <Col sm={6} md={4} lg={9}>
                            <h2 className={styles.centered}>Write</h2>
                            <h3 className={styles.centered}>Express yourself in a blog where other members of the community can comment on your post and connect with you</h3>
                        </Col>
                        <Col sm={6} md={4} lg={3}>
                            <img src="https://freesvg.org/img/cayon.png" className={styles.writing} />
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={styles.box2}>
                <Container>
                    <Row className="align-items-center">
                        <Col sm={6} md={4} lg={3}>
                            <img src="https://freesvg.org/img/Blog-icon.png" className={styles.writing} />
                        </Col>
                        <Col sm={6} md={4} lg={9}>
                            <h2 className={styles.centered}>Read</h2>
                            <h3 className={styles.centered}>Find out what interests fellow students of the past, present, and future and see who shares your interests</h3>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={styles.box3}>
                <Container>
                    <Row className="align-items-center">
                        <Col sm={6} md={4} lg={9}>
                            <h2 className={styles.centered}>Learn</h2>
                            <h3 className={styles.centered}>Exchange research and other knowledge with your peers to foster education outside of the classroom</h3>
                        </Col>
                        <Col sm={6} md={4} lg={3}>
                            <img src="https://freesvg.org/img/afaulconbridge-Lightbulb-OnOff-1.png" className={styles.writing} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}
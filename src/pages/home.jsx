import React from "react";
import styles from "./home.module.css";
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MotionAnimate } from "react-motion-animate";

export function Home() {
    return (
        <div className={styles.home}>
            <div>
                <ul>
                    <span className={styles["weblog-nav"]}>We<span className={styles.bold}>Blog</span></span>
                    <li><Link to="/" className={styles["button-link"]}>Home</Link></li>
                    <li><Link to="/login" className={styles["button-link"]}>Log In</Link></li>
                    <li><Link to="/signup" className={styles["button-link"]}>Sign Up</Link></li>
                    <li><Link to="/categories" className={styles["button-link"]}>Categories</Link></li>
                </ul>
            </div>
            <div className={styles.header}>
                <div className={`${styles["header-content"]} ${styles.centered}`}>
                    <h1>We blog so we can connect</h1>
                    <h2>Share with the Stevens community. Learn from your peers.</h2>
                    <br />
                    <Link to="/signup" className={styles["button-link"]}>
                        <button className={styles.button}>Get Started</button>
                    </Link>
                    <br />
                </div>
            </div>
            <MotionAnimate animation="fadeInUp" reset={true} speed={0.7}>
                <div className={styles.box1}>
                    <h2 className={styles.centered}>"Where the Internet is about availability of information, blogging is about making information creation available to anyone." - George Siemens</h2>
                </div>
            </MotionAnimate>
            <div className={styles.box2}>
                <MotionAnimate animation="fade" reset={true} speed={1}>
                    <Container>
                        <Row className="align-items-center">
                            <Col sm={6} md={4} lg={9}>
                                <h1 className={styles.centered}>Write</h1>
                                <h2 className={styles.centered}>Express yourself in a blog where other members of the community can comment on your post and connect with you</h2>
                                </Col>
                            <Col sm={6} md={4} lg={3}>
                                <img src="https://freesvg.org/img/cayon.png" className={styles.writing} />
                            </Col>
                        </Row>
                    </Container>
                </MotionAnimate>
            </div>
            <div className={styles.box3}>
                <MotionAnimate animation="fade" reset={true} speed={1}>
                    <Container>
                        <Row className="align-items-center">
                            <Col sm={6} md={4} lg={3}>
                                <img src="https://freesvg.org/img/Blog-icon.png" className={styles.writing} />
                            </Col>
                            <Col sm={6} md={4} lg={9}>
                                <h1 className={styles.centered}>Read</h1>
                                <h2 className={styles.centered}>Find out what interests fellow students of the past, present, and future and see who shares your interests</h2>
                            </Col>
                        </Row>
                    </Container>
                </MotionAnimate>
            </div>
            <div className={styles.box4}>
                <MotionAnimate animation="fade" reset={true} speed={1}>
                    <Container>
                        <Row className="align-items-center">
                            <Col sm={6} md={4} lg={9}>
                                <h1 className={styles.centered}>Learn</h1>
                                <h2 className={styles.centered}>Exchange research and other knowledge with your peers to foster education outside of the classroom</h2>
                            </Col>
                            <Col sm={6} md={4} lg={3}>
                                <img src="https://freesvg.org/img/afaulconbridge-Lightbulb-OnOff-1.png" className={styles.writing} />
                            </Col>
                        </Row>
                    </Container>
                </MotionAnimate>
            </div>
        </div>
    )
}
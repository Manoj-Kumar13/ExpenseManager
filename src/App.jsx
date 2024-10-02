import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button } from 'antd';
import { supabase } from './supabaseClient';
import BudgetCard from './components/BudgetCard';
import CategoryModal from './components/CategoryModal';
import CategoryList from './components/CategoryList';
import ReportDownloadButton from './components/ReportDownloadButton';
import AuthForm from './components/Auth';

const { Header, Content } = Layout;

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem("supabaseSession");
    if (storedSession) {
      const session = JSON.parse(storedSession);
      setUser(session.user);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          localStorage.setItem("supabaseSession", JSON.stringify(session));
        }
      });
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
          localStorage.setItem("supabaseSession", JSON.stringify(session));
        } else {
          setUser(null);
          localStorage.removeItem("supabaseSession");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('supabaseSession');
  };

  return (
    <Layout>
      <Header style={{ background: '#1890ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white' }}>Expense Manager</h1>
        {user ? (
          <div>
            <ReportDownloadButton />
            <Button type="primary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : null}
      </Header>
      
      <Content style={{ padding: '50px', background: '#f0f2f5' }}>
        <Row justify="center">
          <Col>
            {user ? (
              <>
                <BudgetCard />
                <CategoryModal />
                <CategoryList />
              </>
            ) : (
              <AuthForm setUser={setUser} />
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default App;

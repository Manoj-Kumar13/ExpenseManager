import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button } from 'antd';
import { supabase } from './supabaseClient';  // import supabase client
import BudgetCard from './components/BudgetCard';
import CategoryModal from './components/CategoryModal';
import CategoryList from './components/CategoryList';
import ReportDownloadButton from './components/ReportDownloadButton';
import AuthForm from './components/Auth'; // new auth form component

const { Header, Content } = Layout;

const App = () => {
  const [user, setUser] = useState(null);

  // Check if a user is already signed in when the app loads
  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, []);

  // Sign out function
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Layout>
      <Header style={{ background: '#1890ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white' }}>Expense Manager</h1>
        {user ? (
          <>
            <ReportDownloadButton />
            <Button type="primary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : null}
      </Header>
      
      <Content style={{ padding: '50px', background: '#f0f2f5' }}>
        <Row justify="center">
          <Col>
            {/* If the user is logged in, show the budget and category sections */}
            {user ? (
              <>
                <BudgetCard />
                <CategoryModal />
                <CategoryList />
              </>
            ) : (
              // Show the authentication form if no user is logged in
              <AuthForm setUser={setUser} />
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default App;

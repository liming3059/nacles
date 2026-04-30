// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({onLogin, theme}) {
  const T = THEMES[theme] || THEMES.blue;
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [focusField, setFocusField] = React.useState('');

  function handleLogin(e) {
    e.preventDefault();
    if (!user || !pass) { setErr('请输入用户名和密码'); return; }
    setLoading(true); setErr('');
    setTimeout(()=>{ setLoading(false); onLogin(); }, 1100);
  }

  const inputWrap = (id, label, type, value, onChange, placeholder) =>
    React.createElement('div', {style:{marginBottom:18}},
      React.createElement('label', {
        style:{fontSize:12,fontWeight:600,color:'#6b7280',display:'block',marginBottom:6,letterSpacing:.4,textTransform:'uppercase'}
      }, label),
      React.createElement('input', {
        id, type, value, onChange, placeholder,
        onFocus:()=>setFocusField(id),
        onBlur:()=>setFocusField(''),
        style:{
          width:'100%', padding:'12px 16px', borderRadius:10,
          border:'1.5px solid '+(focusField===id?T.primary:'#e5e7eb'),
          fontSize:15, outline:'none', transition:'border .15s, box-shadow .15s',
          boxSizing:'border-box', fontFamily:'inherit', background:'#fff',
          boxShadow:focusField===id?`0 0 0 3px ${T.primary}22`:'none',
        }
      })
    );

  return React.createElement('div', {
    style:{
      minHeight:'100vh', display:'flex',
      background:'#f0f6ff',
    }
  },
    // Left panel — branding
    React.createElement('div', {
      style:{
        flex:'0 0 480px', display:'flex', flexDirection:'column',
        background:`linear-gradient(160deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
        padding:'56px 48px', position:'relative', overflow:'hidden',
        alignItems:'flex-start', justifyContent:'space-between',
      }
    },
      // Decorative circles
      React.createElement('div', {style:{position:'absolute',top:-100,right:-100,width:400,height:400,borderRadius:'50%',background:'rgba(255,255,255,0.07)',pointerEvents:'none'}}),
      React.createElement('div', {style:{position:'absolute',bottom:-80,left:-80,width:280,height:280,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none'}}),
      React.createElement('div', {style:{position:'absolute',bottom:160,right:-40,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none'}}),

      // Top: logo + name
      React.createElement('div', {style:{display:'flex',alignItems:'center',gap:14,position:'relative',zIndex:1}},
        React.createElement('img', {src:'assets/hospital-logo.png', style:{height:52,filter:'brightness(0) invert(1) opacity(.95)'}}),
        React.createElement('div', null,
          React.createElement('div', {style:{fontSize:13,color:'rgba(255,255,255,0.75)',fontWeight:500,letterSpacing:.5}},'江苏省人民医院'),
          React.createElement('div', {style:{fontSize:12,color:'rgba(255,255,255,0.5)'}},'Jiangsu Province Hospital'),
        )
      ),

      // Center: main title
      React.createElement('div', {style:{position:'relative',zIndex:1}},
        React.createElement('div', {style:{
          display:'inline-block', padding:'4px 12px', borderRadius:6,
          background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.9)',
          fontSize:12, fontWeight:600, letterSpacing:1, marginBottom:20,
        }}, '肝胆外科 · 临床诊疗平台'),
        React.createElement('h1', {style:{
          fontSize:34, fontWeight:800, color:'#fff', margin:'0 0 16px',
          lineHeight:1.25, letterSpacing:.5,
        }}, '转移性肝癌患者\n登记系统'),
        React.createElement('p', {style:{
          fontSize:14, color:'rgba(255,255,255,0.65)', margin:0, lineHeight:1.7, maxWidth:320,
        }},
          '专注转移性肝癌患者的全程临床管理，涵盖诊断、治疗方案记录与随访跟踪，助力临床决策。'
        ),

        // Clinical highlights
        React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:10,marginTop:32}},
          [
            {icon:'🏥', text:'多学科联合诊疗（MDT）记录'},
            {icon:'💊', text:'系统治疗与局部治疗全程追踪'},
            {icon:'📋', text:'规范化随访与疗效评估'},
          ].map((item,i)=>
            React.createElement('div', {key:i, style:{display:'flex',alignItems:'center',gap:10}},
              React.createElement('span',{style:{fontSize:14}},item.icon),
              React.createElement('span',{style:{fontSize:13,color:'rgba(255,255,255,0.75)'}},item.text),
            )
          )
        ),
      ),

      // Bottom: team note
      React.createElement('div', {style:{position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:12}},
        React.createElement('div', {style:{
          width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.2)',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',
        }},'浦'),
        React.createElement('div', null,
          React.createElement('div', {style:{fontSize:13,fontWeight:600,color:'#fff'}},'浦立勇 主任医师'),
          React.createElement('div', {style:{fontSize:11,color:'rgba(255,255,255,0.55)'}},'江苏省人民医院肝胆外科'),
        )
      ),
    ),

    // Right panel — form
    React.createElement('div', {
      style:{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'48px 32px',
      }
    },
      React.createElement('div', {style:{width:'100%',maxWidth:400}},
        React.createElement('h2', {style:{fontSize:24,fontWeight:700,color:'#111827',margin:'0 0 6px'}},'欢迎登录'),
        React.createElement('p', {style:{fontSize:14,color:'#9ca3af',margin:'0 0 36px'}},'使用您的账号和密码登录系统'),

        React.createElement('form', {onSubmit:handleLogin},
          inputWrap('user','账号','text',user,e=>setUser(e.target.value),'请输入账号'),
          inputWrap('pass','密码','password',pass,e=>setPass(e.target.value),'请输入密码'),

          err && React.createElement('div', {
            style:{
              display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:8,
              background:'#fef2f2',border:'1px solid #fecaca',marginBottom:16,
            }
          },
            React.createElement('span',{style:{color:'#ef4444',fontSize:14}},'⚠'),
            React.createElement('span',{style:{fontSize:13,color:'#dc2626'}},err),
          ),

          React.createElement('div', {style:{display:'flex',justifyContent:'flex-end',marginBottom:20}},
            React.createElement('span', {style:{fontSize:12,color:'#9ca3af',cursor:'pointer'}},'忘记密码？'),
          ),

          React.createElement('button', {
            type:'submit',
            style:{
              width:'100%', padding:'13px', borderRadius:10, border:'none',
              background:loading?T.primaryBg:T.primary,
              color:loading?T.primary:'#fff',
              fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer',
              transition:'all .2s', letterSpacing:.5,
              boxShadow:loading?'none':`0 4px 16px ${T.primary}44`,
            }
          }, loading
            ? React.createElement('span',{style:{display:'flex',alignItems:'center',justifyContent:'center',gap:8}},
                React.createElement('span',{style:{
                  width:14,height:14,borderRadius:'50%',
                  border:'2px solid '+T.primary,borderTopColor:'transparent',
                  display:'inline-block',animation:'spin .6s linear infinite',
                }}),
                '登录中…'
              )
            : '登 录'
          ),
        ),

        React.createElement('div', {
          style:{
            marginTop:32,padding:'14px 16px',borderRadius:10,
            background:'#f8fafc',border:'1px solid #f1f5f9',
            fontSize:12,color:'#9ca3af',textAlign:'center',lineHeight:1.7,
          }
        },
          '本系统仅限授权医疗人员使用',React.createElement('br'),
          '© 2024 江苏省人民医院肝胆外科研究组',
        ),
      ),
    ),

    // Spin keyframe
    React.createElement('style',null,`@keyframes spin { to { transform: rotate(360deg); } }`),
  );
}

Object.assign(window, { LoginScreen });

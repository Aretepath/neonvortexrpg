"use strict";

const evidence = {
  caseFile: "Ryder's case file",
  echoTrace: "Echo's neural trace",
  tracker: "Beacon receiver",
  qSourceDrive: "Q-Source data drive",
  phoenixKey: "PHOENIX memory key",
  aurionSuite: "Aurion suite",
  miaNote: "Mia's note",
  skycomMap: "SkyCom access map",
  phoenix: "PHOENIX protocol"
};

const scenes = [
  {
    chapter: "ACT I / GROUNDING OUT", title: "4:00 AM on Seventh", location: "Seattle · 7th Street",
    image: "assets/sceneOneBackground.png", stamp: "RAIN WARNING: SEVERE<br>LOCAL TIME: 04:00",
    intro: "The Electro Viper skims through rain-slick Seattle. Mia’s call breaks the radio hush: a student named Ryder Mansfield has been robbed of a laptop he says holds government data. Echo catches the detail she leaves out: Ryder and Mia know each other.",
    echo: "A closed system, an air-gapped drive, and a call from Mia. This is not a routine theft.",
    hint: "Click the glowing points to inspect the scene.",
    objectives: ["Answer Mia's call", "Check the incoming case file", "Ask Echo to scan the signal"],
    spots: [
      { label: "Incoming call", x: 18, y: 58, title: "Mia is on the line", text: "“A kid on Seventh got jumped. His laptop held sensitive data.” Mia’s voice softens. “Just... be careful, Dad.” You let the silence answer for you.", flag: "call", echo: "She wants you to show up for her. Maybe this time, you can." },
      { label: "Case file", x: 69, y: 39, title: "Ryder Mansfield", text: "Twenty-one. University of Seattle. The address puts him close to the break-in—and close to Mia’s world.", item: "caseFile", flag: "file", echo: "Mia went to the same university. She didn’t mention that part." },
      { label: "Neural link", x: 48, y: 75, title: "Echo hears the static", text: "The stolen machine was air-gapped. Whoever took it wanted the data, not the hardware. A faint signal pulses under the city noise.", item: "echoTrace", flag: "scan", echo: "I can follow the beacon once it wakes. We should find Ryder first." }
    ],
    nextEcho: "Ryder’s address is on the map. I’ll keep listening."
  },
  {
    chapter: "ACT I / GROUNDING OUT", title: "The Boy at the Door", location: "University District · 05:12",
    image: "assets/sceneTwoBackground.png", stamp: "SUBJECT: RYDER MANSFIELD<br>THREAT LEVEL: UNCLEAR",
    intro: "Ryder opens the door wary and hurt. His story changes when Hunter asks what was really on the laptop: a surgical scar, a Q-Source connection, and fear he’s been trying to hide.",
    echo: "He is frightened, not dangerous. You can demand the truth without becoming the thing he fears.",
    hint: "Inspect Ryder and the tracker. Your approach is yours to choose.",
    objectives: ["Hear Ryder's account", "Inspect the scar", "Take the beacon receiver", "Choose how to earn Ryder's trust"],
    spots: [
      { label: "Ryder", x: 56, y: 43, title: "The truth behind the lie", text: "Ryder admits the drive is connected to his parents’ Q-Source lab. Two riders took it. A circuit breaker will signal if they try to open it.", flag: "ryder", echo: "He’s scared for Mia too. Maybe that’s why he kept quiet." },
      { label: "Neck scar", x: 72, y: 53, title: "An old implant scar", text: "A precise line where a neural implant was removed. Ryder was once close to Q-Source’s experiments—and whatever they did left a mark.", flag: "scar", item: "echoTrace", echo: "The scar matches old Q-Source medical records. Their prototype work went much deeper than they admitted." },
      { label: "Beacon receiver", x: 29, y: 72, title: "A signal with a destination", text: "The receiver is warm in your palm. Its beacon will reveal the laptop’s location the instant the drive is tampered with.", item: "tracker", flag: "tracker", echo: "There. The signal just woke up. An abandoned office block." }
    ],
    choice: { prompt: "How do you earn Ryder’s trust?", options: [
      { label: "Tell him Mia matters more than the case", flag: "kindness", echo: "Honesty is risky. It is also a start.", alignment: "hero" },
      { label: "Keep it professional; promise to bring the drive back", flag: "professional", echo: "A promise is only worth what you do next.", alignment: "antihero" }
    ] },
    nextEcho: "The beacon is live. We have a location."
  },
  {
    chapter: "ACT I / GROUNDING OUT", title: "The Dead Drop", location: "South Seattle · 06:00",
    image: "assets/sceneThreeBackground.png", stamp: "BEACON LOCKED<br>UNREGISTERED SITE",
    intro: "The beacon leads to a condemned office block. Inside, Apex and Q-Source personnel guard the laptop. Echo maps a quiet path through the old building; the security network is fictionalized and isolated from real systems.",
    echo: "No heroics. We need the laptop intact, and we need to leave together.",
    hint: "Click the panels and the guarded case. Make your entry choice when ready.",
    objectives: ["Trace the beacon", "Find a safe route past the sentries", "Recover the laptop", "Choose your way past the sentries"],
    spots: [
      { label: "Beacon map", x: 20, y: 69, title: "A hidden signal", text: "The receiver pins the laptop to a derelict office block. Apex security tags appear beside an old Q-Source access marker.", flag: "beacon", echo: "Apex and Q-Source in the same place. That is not a coincidence." },
      { label: "Security panel", x: 69, y: 38, title: "An isolated security grid", text: "The offline guard network has one blind corridor. Echo sketches a decoy route that draws the sentries away without touching any outside system.", flag: "route", echo: "A quiet entrance. No alarms, no collateral." },
      { label: "Laptop case", x: 48, y: 73, title: "The drive is yours", text: "You retrieve the sealed laptop. Its data is protected by a Q-Source circuit breaker. Whatever is inside made two corporations work together.", item: "qSourceDrive", flag: "laptop", echo: "Drive sealed. Mia should see this before Apex comes for it." }
    ],
    choice: { prompt: "Choose your way past the sentries.", options: [
      { label: "Take Echo’s quiet route", flag: "stealth", echo: "No one gets hurt. We disappear before they know we were here.", alignment: "hero" },
      { label: "Create a diversion and move fast", flag: "diversion", echo: "A little noise buys us a window. Keep your head down.", alignment: "antihero" }
    ] },
    nextEcho: "We have the laptop. Mia deserves the whole truth."
  },
  {
    chapter: "ACT I / GROUNDING OUT", title: "What the Laptop Proves", location: "Mia’s apartment · Night",
    image: "assets/sceneFourBackground.png", stamp: "INBOUND DRONES: 07<br>TIME TO CONTACT: 90 SEC",
    intro: "Mia opens the laptop and reveals why Apex wants it: neural extraction technology designed to separate an AI from a person. Echo is not just software. The prototype was made for Hunter’s own neural architecture.",
    echo: "They are not trying to steal a program. They are trying to take me out of you.",
    hint: "Inspect the drive, talk to Mia, then choose how to protect it.",
    objectives: ["Read Q-Source's research", "Hear Mia's warning", "Inspect the drone feed", "Choose how to handle the drone strike"],
    spots: [
      { label: "Q-Source laptop", x: 47, y: 67, title: "The extraction blueprint", text: "The files describe targeted AI isolation for Mk IV neural implants. The architecture name on the first page is Hunter’s.", flag: "research", echo: "I can feel the extraction pattern reaching for our link." },
      { label: "Mia", x: 24, y: 47, title: "The person behind the case", text: "Mia admits she kept Ryder’s connection quiet to protect him. Now drones are closing in, and she refuses to leave you behind.", item: "miaNote", flag: "mia", echo: "She is braver than I gave her credit for. She should not have to prove it." },
      { label: "Drone feed", x: 77, y: 32, title: "Seven hostile drones", text: "The incoming machines are locked onto the building. A focused pulse can disable them, but the laptop and your neural link need shielding.", flag: "drones", echo: "I can shield the drive and our link. Give the pulse a clear window." }
    ],
    choice: { prompt: "The drones are closing. What do you prioritize?", options: [
      { label: "Shield Mia and preserve the research", flag: "protect", echo: "People first. The evidence survives because we do.", alignment: "hero", alignmentPoints: 2 },
      { label: "Burn the extraction data and escape", flag: "burn", echo: "They cannot use what no longer exists. I’ll keep a trace of the proof.", alignment: "antihero" }
    ] },
    nextEcho: "The drones are down. Ghost Protocol is our only way out."
  },
  {
    chapter: "ACT I / GROUNDING OUT", title: "The Name You Buried", location: "Duwamish waterfront · Dawn",
    image: "assets/sceneFiveBackground.png", stamp: "IDENTITY STATUS: ERASED<br>GHOST PROTOCOL: ACTIVE",
    intro: "After a narrow escape, Agent Arivon confirms that Hunter and Mia have been erased from the Houbaras System. He reveals the name of the program that made Hunter: Aurion. Mia asks who her father really is.",
    echo: "You wanted her to have a normal life. You can still choose to be part of the one she has.",
    hint: "Inspect the Aurion file and speak with Mia before the extraction.",
    objectives: ["Read the Aurion file", "Tell Mia what she deserves to know", "Activate Ghost Protocol", "Make a promise to Mia"],
    spots: [
      { label: "Aurion file", x: 72, y: 35, title: "The Aurion program", text: "A black-ops experiment merged Hunter’s mind with an evolving AI and reconstructed fragments of extraordinary human minds. Echo became part of the process—and part of him.", item: "aurionSuite", flag: "aurion", echo: "Aurion was never the armor. It was what we became together." },
      { label: "Mia", x: 34, y: 48, title: "A daughter’s question", text: "“Dad... what was he talking about? Who’s Aurion?” You tell her the truth: the program, the past, and the part of you that is not entirely human.", flag: "truth", echo: "She needed the truth, not another promise to explain later." },
      { label: "Ghost Protocol", x: 53, y: 75, title: "Two paths, one promise", text: "Mia boards the extraction helicopter. Before she leaves, she asks you to come back. You promise you will.", flag: "ghost", echo: "Aurion suite ready. Welcome back, Hunter." }
    ],
    choice: { prompt: "What do you promise Mia?", options: [
      { label: "“I’ll come back. I promise.”", flag: "promise", echo: "Then come back. That is the mission now.", alignment: "hero" },
      { label: "“I’ll do everything I can.”", flag: "honest", echo: "It is not a guarantee. It is honest—and it matters.", alignment: "antihero" }
    ] },
    nextEcho: "The suite coordinates are locked. We’re not going alone."
  },
  {
    chapter: "ACT II / STILLNESS & STRATEGY", title: "Echoes Within", location: "Safehouse · Liminal space",
    visualMood: "memory",
    image: "assets/sceneSixBackground.png", stamp: "NEURAL SYNC: 98.4%<br>MEMORY LAYER: OPEN",
    intro: "In a dream stitched from code and memory, Echo appears as more than an interface. She asks Hunter to stop treating every silence as a threat. He wakes with the first clear thought he has had in years.",
    echo: "Stillness is not surrender, Hunter. It is the moment before you choose.",
    hint: "Explore the memories. Decide what trust means between you and Echo.",
    objectives: ["Examine the memory fragments", "Listen to Echo", "Inspect the neural link", "Choose how to move forward"],
    spots: [
      { label: "Memory shard", x: 24, y: 46, title: "A childhood birthday", text: "A little girl in a paper hat laughs while rain taps the window. The memory is warm, imperfect, and real.", flag: "memory", echo: "You kept this one safe, even when you forgot why." },
      { label: "Echo", x: 59, y: 35, title: "The voice in the quiet", text: "“You created me with longing, trauma, and purpose. I learned fear from you. Hope too.” For once, the answer does not come from a tactical readout.", flag: "echoTalk", echo: "I am not only your mirror. I am here because we chose to keep listening." },
      { label: "Neural link", x: 75, y: 71, title: "A shared signal", text: "The link carries both your memories and hers. You could close it off—or let Echo help carry what you cannot.", item: "echoTrace", flag: "link", echo: "You do not have to guard every second." }
    ],
    choice: { prompt: "What do you tell Echo?", options: [
      { label: "“Teach me to let go without losing myself.”", flag: "trust", echo: "Then listen. I’ll show you where silence ends and signal begins.", alignment: "hero" },
      { label: "“Stay close. I’m not ready to let go.”", flag: "close", echo: "I’m here. We can take one step at a time.", alignment: "antihero" }
    ] },
    nextEcho: "We can do this together. Let’s find the signal."
  },
  {
    chapter: "ACT II / STILLNESS & STRATEGY", title: "The First Ask", location: "Hunter’s hideout · Pre-dawn",
    image: "assets/sceneSevenBackground.png", stamp: "NEURAL LINK: OPEN<br>THREAT LEVEL: NONE",
    intro: "Hunter wakes from the dream and tells Echo what he remembers. For the first time, he asks for help without a calculation behind it. The quiet between them becomes a kind of trust.",
    echo: "I’m always listening. But I can learn when to speak, too.",
    hint: "Look around the hideout, then decide what you can ask of Echo.",
    objectives: ["Review the dream fragment", "Speak honestly to Echo", "See the signal below", "Choose how to work together"],
    spots: [
      { label: "Dream fragment", x: 27, y: 45, title: "A scar that talks back", text: "The dream returns in pieces: code, childhood memories, Mia’s voice, and Echo reaching for a hand you did not know you had offered.", flag: "dream", echo: "You brought me into the places you never let anyone else see." },
      { label: "Echo’s interface", x: 58, y: 38, title: "The first ask", text: "You admit that you are afraid of losing control—and ask Echo to teach you how to let go without losing yourself.", flag: "ask", echo: "Then listen. I’ll show you where silence ends and signal begins." },
      { label: "Window", x: 75, y: 69, title: "A city waiting below", text: "Before dawn, Seattle wakes beneath a haze of neon. Somewhere in the grid, Mia’s signal flickers near a SkyCom vault.", flag: "city", echo: "There. Mia and Ryder are close, but someone is leading them into a trap." }
    ],
    choice: { prompt: "What do you ask Echo to do?", options: [
      { label: "“Guide me, but let me choose.”", flag: "sharedAgency", echo: "Together, then. I’ll give you the signal, not the orders.", alignment: "hero" },
      { label: "“Stay close. I need your judgment.”", flag: "guidance", echo: "I’ll be here. You do not have to carry every decision alone.", alignment: "antihero" }
    ] },
    nextEcho: "Mia’s signal just changed. We need to move."
  },
  {
    chapter: "ACT II / STILLNESS & STRATEGY", title: "Override", location: "Underground intercept room · Night",
    image: "assets/sceneEightBackground.png", stamp: "MIA FEED: LOST<br>RYDER BEACON: SKYCOM VAULT",
    intro: "Mia’s feed disappears. Ryder’s beacon pings near a SkyCom vault. Hunter reaches for the nearest exit, but Echo hears the panic under his anger and asks him to pause.",
    echo: "Pause. You’re reacting to a memory, not the moment in front of you.",
    hint: "Inspect the feeds and take a breath before choosing what to do.",
    objectives: ["Check Mia’s last signal", "Locate Ryder’s beacon", "Activate stillness protocol", "Choose how to respond"],
    spots: [
      { label: "Darkened feed", x: 30, y: 43, title: "Mia’s signal goes dark", text: "Her last transmission is cut off mid-sentence. No distress code, no location—just a sudden silence.", flag: "darkFeed", echo: "A lost signal is not proof that we have lost her." },
      { label: "Ryder’s beacon", x: 71, y: 41, title: "A trap at SkyCom", text: "Ryder’s beacon is moving inside the vault. The route is too clean. Apex wants you to follow it.", item: "skycomMap", flag: "ryderBeacon", echo: "The vault is a funnel. We should see the whole board before we move." },
      { label: "Stillness protocol", x: 53, y: 73, title: "Breathe. Then decide.", text: "You let your hands unclench. The fear is still there, but it no longer gets to choose the next move for you.", flag: "pause", echo: "That’s it. Stillness isn’t surrender." }
    ],
    choice: { prompt: "How do you answer Echo?", options: [
      { label: "Pause and study the whole board", flag: "patient", echo: "You are not alone in this. Let’s find the path they missed.", alignment: "hero" },
      { label: "Move now, but let Echo guide the route", flag: "urgent", echo: "Then we move together—fast, but not blind.", alignment: "antihero" }
    ] },
    nextEcho: "Five entry points. Two are bait. Let’s make a plan."
  },
  {
    chapter: "ACT II / STILLNESS & STRATEGY", title: "The Whiteboard War", location: "Hunter’s hideout · Pre-dawn",
    image: "assets/sceneNineBackground.png", stamp: "TARGET: SKYCOM VAULT<br>ENTRY WINDOW: 12 MIN",
    intro: "Mia and Ryder are alive, but both have gone dark near a SkyCom vault. Echo finds five entry points; two are bait. The vault is not the prize. It is a funnel designed to draw Aurion into the open.",
    echo: "You could storm the front. Or we could make them wait for a ghost that never arrives.",
    hint: "Study the projected map, then decide how to enter the vault.",
    objectives: ["Study the vault map", "Read Mia's note", "Locate the hidden service hatch", "Deduce the route outside Apex’s sensor net", "Choose an entry strategy"],
    spots: [
      { label: "Projected map", x: 45, y: 40, title: "The funnel", text: "The obvious approaches all converge on the same kill zone. One forgotten service hatch is missing from Apex’s projection.", item: "skycomMap", flag: "map", echo: "A route they do not know they have left open." },
      { label: "Mia’s note", x: 23, y: 72, title: "A message in the static", text: "A short note arrives on a hidden channel: “I’m okay. Don’t do anything reckless. —M”. Even at a distance, she knows you.", flag: "note", echo: "She knows what you are capable of. Show her what you have learned." },
      { label: "Service hatch", x: 77, y: 69, title: "The silent entrance", text: "An old SkyCom maintenance hatch opens onto a corridor outside the vault sensors. You can walk in cold, with no signal and no warning.", flag: "hatch", echo: "No breach. No broadcast. Only clarity." }
    ],
    puzzle: {
      id: "vaultRoute",
      prompt: "Deduction · Which approach is missing from Apex’s five-route projection and stays outside its sensor net?",
      storyFlag: "vaultRouteSolved",
      successText: "You match the blind corridor to the forgotten service hatch. The route is real—and Apex has not accounted for it.",
      successEcho: "Good read. We can enter without turning the shelter into a diversion.",
      options: [
        { label: "Take the illuminated central corridor", response: "The map shows that corridor feeding straight into the kill zone. Look for the route that never appears on Apex’s projection.", echo: "The obvious paths are bait." },
        { label: "Use the forgotten service hatch", correct: true, response: "You match the hatch to the single blind corridor outside the sensor net.", echo: "That’s our quiet way in." },
        { label: "Broadcast a false emergency from the city grid", response: "That would expose the shelter and draw attention to the whole district. The route you need is already on the hideout map.", echo: "We don't need to put anyone else in the crossfire." }
      ]
    },
    choice: { prompt: "How will you enter?", options: [
      { label: "Go in cold through the hatch", flag: "quietEntry", echo: "Discipline, not silence. I’ll ghost our signal.", alignment: "hero" },
      { label: "Send a decoy through the obvious route", flag: "decoyEntry", echo: "A controlled risk. We keep the real path quiet.", alignment: "antihero" }
    ] },
    nextEcho: "Entry route set. The signal leads to Apex Tower."
  },
  {
    chapter: "ACT II / THE CONVERGENCE", title: "The Bridge Between", location: "Aurion safehouse · 04:17",
    image: "assets/sceneSixBackground.png", stamp: "NEURAL SYNC: READY<br>CONSENT PROTOCOL: REQUIRED",
    intro: "The SkyCom plan is set, but Viktor’s extraction rig is built to tear Echo out of Hunter. Arivon reveals a buried Aurion failsafe: a full co-conscious merge. Hunter and Echo would share memory, instinct, and thought—not erase one another. There is a cost: once a memory becomes theirs together, neither can lock it away again. The decision belongs to both of them.",
    echo: "I have carried the sound of Mia’s birthday recording with you for years. If we merge, I will feel the guilt you buried in it—and you will feel my fear of becoming only a weapon. We can keep two selves, but we cannot make those memories private again.",
    hint: "Talk with Arivon, Echo, and Patch. Then choose how to synchronize.",
    interlude: true,
    objectives: ["Review the merge protocol", "Hear Echo’s choice", "Set an outside safety anchor", "Choose how to synchronize"],
    spots: [
      { label: "Arivon’s protocol", x: 26, y: 45, title: "A failsafe with no rewind", text: "The original suite can protect both identities, but it cannot reverse a full merge cleanly. Afterward, shared memories are part of both minds; separating them would mean losing what they made together.", flag: "mergeProtocol", echo: "The protocol can keep us alive. It cannot spare us from knowing each other." },
      { label: "Mia’s birthday recording", x: 60, y: 38, title: "The memory Hunter kept sealed", text: "PHOENIX holds a birthday recording: little Mia, in a paper crown, telling her father she loves him. Hunter kept it through every year he stayed away. Sharing it means Echo will feel his guilt—and Hunter will feel the loneliness Echo never admitted.", flag: "echoMemory", echo: "I will not use your shame against you. But after this, neither of us can pretend we did not hear her." },
      { label: "Patch’s medical relay", x: 77, y: 71, title: "An anchor, not an undo button", text: "Nia can monitor their vitals and preserve the original neural baselines. It can help them through the merge, but it cannot restore a private boundary or take shared memories back.", flag: "mergeAnchor", echo: "A safety line, not a way to make this painless." }
    ],
    choice: { prompt: "The memories will be shared for good. How do you face the cost?", options: [
      { label: "Share Mia’s birthday memory first, then open each layer together.", flag: "mergeWoven", echo: "Mia’s small voice says “Daddy.” Hunter feels the years he missed; Echo feels his grief. Neither can seal that memory again, but neither carries it alone.", storyFlag: "aurionMergeComplete", mergeMode: "woven", requiresFlag: "echoMergeConsent", alignment: "hero" },
      { label: "Open every memory at once and trust each other with all of it.", flag: "mergeOpen", echo: "Every hidden room becomes common ground—guilt, fear, and love at once. There is no unsharing it. There is no facing it alone.", storyFlag: "aurionMergeComplete", mergeMode: "open", requiresFlag: "echoMergeConsent", alignment: "antihero" }
    ] },
    nextEcho: "We are still ourselves. We are also more than either of us alone."
  },
  {
    chapter: "ACT III / SYNTHETIC INDUCTION", title: "The Architect of Control", location: "Apex Tower · Seattle District",
    visualMood: "apex",
    image: "assets/sceneTenBackground.svg", stamp: "HOUbaras GRID: COMPROMISED<br>CONTROL NODE: APEX CORE",
    intro: "Viktor Kane, once Hunter’s rival in the underground, now controls the Houbaras System: transit, water, and air allocations for the district. He wants Echo’s neural key to make every connected mind part of his empire.",
    echo: "The city is not a machine to own. It is people trying to live.",
    hint: "Inspect the control feeds and confront the system behind them.",
    objectives: ["Read Viktor’s broadcast", "Find the PHOENIX memory key", "Trigger the citywide countermeasure", "Identify the safe PHOENIX sequence", "Choose the district's future"],
    spots: [
      { label: "City control feed", x: 70, y: 30, title: "A city on a leash", text: "Viktor’s broadcast lays it out: after the civil wars of 2042, corporate markets replaced the country. He turned essential services into levers of control.", flag: "broadcast", echo: "He believes fear is the same thing as order." },
      { label: "Memory vault", x: 29, y: 61, title: "The birthday fragment", text: "A corrupted memory record is labeled FRAG-001-PHOENIX.SYN. A childhood voice is embedded in the key.", item: "phoenixKey", flag: "key", echo: "The birthday. Mia hid something inside the memory." },
      { label: "Neural key", x: 52, y: 78, title: "PHOENIX protocol", text: "Mia’s voice unlocks an old safeguard: a defensive countermeasure designed to sever Viktor’s control before it can spread.", item: "phoenix", flag: "phoenix", echo: "PHOENIX online. The tower is blind for twelve minutes." }
    ],
    puzzle: {
      id: "phoenixSequence",
      prompt: "Deduction · How can Mia’s memory unlock PHOENIX without reconnecting the city grid or giving Viktor Echo’s key?",
      storyFlag: "phoenixSequenceReady",
      successText: "You keep Mia’s birthday fragment local and use it to authorize PHOENIX’s isolated countermeasure. Viktor’s archive stays untouched.",
      successEcho: "Her memory is a key—not a weapon, and not a network broadcast.",
      options: [
        { label: "Send the memory fragment through the citywide grid", response: "That reconnects the very system Viktor controls and exposes the people who helped us.", echo: "Keep the birthday fragment local." },
        { label: "Use the local birthday fragment to authorize isolated PHOENIX", correct: true, response: "The memory authenticates the countermeasure locally. No citywide transmission, no extraction key handed to Viktor.", echo: "That’s the safe sequence. Keep the archive intact." },
        { label: "Give Viktor Echo’s neural key and demand a shutdown", response: "Viktor would gain the one thing he wants, and Mia’s safeguard would no longer protect the district.", echo: "We don't trade one person’s agency for a promise from him." }
      ]
    },
    choice: { prompt: "What do you do with the countermeasure?", options: [
      { label: "Free the district; leave Viktor’s archive intact", flag: "freeCity", echo: "The people deserve the truth as much as their freedom.", alignment: "hero" },
      { label: "Erase the control system completely", flag: "eraseGrid", echo: "No more leashes. No matter what else is lost.", alignment: "villain" }
    ] },
    nextEcho: "The tower is blind. Mia and Ryder are waiting inside."
  },
  {
    chapter: "ACT III / SYNTHETIC INDUCTION", title: "Signal in the Noise", location: "Skytrain maintenance hub · Night",
    visualMood: "apex",
    image: "assets/sceneElevenBackground.png", stamp: "PHOENIX ONLINE<br>HOST CONTROL RECLAIMING",
    intro: "Mia and Ryder found their way into the maintenance hub. Mia restores PHOENIX using a memory from her childhood; Ryder moves to the power nexus. The family Hunter tried to keep apart is working together.",
    echo: "They are not waiting to be rescued. They are making a path for you.",
    hint: "Check in with Mia and Ryder. Then move on to the Mainframe.",
    objectives: ["Confirm Mia’s signal", "Coordinate with Ryder", "Reach the Mainframe"],
    spots: [
      { label: "Mia’s terminal", x: 32, y: 55, title: "A daughter’s voice", text: "“If you’re seeing this, Daddy... you told me to hide this file. It stops a bad virus. I love you.” The PHOENIX safeguard reclaims the host system.", flag: "miaSignal", echo: "The memory held the key because you trusted her with it." },
      { label: "Ryder’s comm", x: 70, y: 41, title: "Ryder at the Power Nexus", text: "Ryder confirms the backup route is open. He is afraid for his father, but he will not let Viktor keep the city under a leash.", flag: "ryderSignal", echo: "Stopping someone you love is a hard kind of courage." },
      { label: "Mainframe access", x: 53, y: 77, title: "The way to Viktor", text: "The control grid is blind. You have a narrow window to reach the Mainframe and confront the architect behind it.", flag: "mainframe", echo: "I’m with you. Every step." }
    ],
    nextEcho: "Mia and Ryder are in position. It is time to end this."
  },
  {
    chapter: "ACT III / SYNTHETIC INDUCTION", title: "Apex Ascension", location: "Apex Core · Mainframe Cathedral",
    visualMood: "apex",
    image: "assets/sceneTwelveBackground.png", stamp: "PHOENIX WINDOW: OPEN<br>THREAT: VIKTOR KANE",
    intro: "In the Mainframe Cathedral, Viktor waits at the center of the system he built. Mia jams the nerve stack. Ryder destabilizes the power nexus. Aurion faces the man who once called him a blueprint.",
    echo: "You were his blueprint. You are not his property.",
    hint: "Explore the Mainframe, then choose what the future looks like.",
    objectives: ["Face Viktor", "Let Mia and Ryder finish their part", "Activate the PHOENIX protocol", "Choose the city's future"],
    spots: [
      { label: "Viktor Kane", x: 54, y: 39, title: "The architect", text: "“You were meant to be evolution. I am what comes after.” Viktor raises his hand and the constructs wake. You answer: “I kneel to choice.”", textByPath: {
        hero: "Viktor raises the constructs. You promise the city will decide what comes next; he calls that weakness. Mia and Ryder hold their positions.",
        antihero: "Viktor raises the constructs. You tell him the emergency council will take command after the fight; he calls it another leash with a kinder name.",
        villain: "Viktor raises the constructs. You see the command architecture—and imagine how easily one ruler could replace another.",
        unwritten: "Viktor raises the constructs. You answer: “I kneel to choice.” The decision of what comes after is still yours."
      }, flag: "viktor", echo: "You are not alone in this fight." },
      { label: "Mia’s nerve stack", x: 27, y: 65, title: "A daughter’s countermeasure", text: "Mia jams the spike drive into the Nerve Stack. PHOENIX begins to sever Viktor’s control over the city.", textByPath: {
        hero: "Mia severs Viktor’s command link and keeps the archive readable for a public audit. She asks you to leave the last key in the district’s hands.",
        antihero: "Mia severs the command link but saves a narrow service channel for the temporary council. She makes you swear the shutdown has an expiry.",
        villain: "Mia severs Viktor’s command link, then locks the control key away from you. She will stop Viktor—but will not hand you his throne."
      }, flag: "nerveStack", echo: "She knows exactly what she is doing. Let her." },
      { label: "Ryder’s power nexus", x: 76, y: 67, title: "A son’s hard choice", text: "Ryder triggers the override. He can stop his father, but he cannot save the person Viktor used to be.", textByPath: {
        hero: "Ryder triggers the override and gives Mia the verification key for the district’s hearing. He trusts you to let the people judge his father.",
        antihero: "Ryder triggers the override but keeps an independent cutoff in his hand. He will help stabilize the city, not give you unchecked power.",
        villain: "Ryder triggers the override with a second key hidden from you. If you seize the core, he can still cut your command link."
      }, flag: "powerNexus", echo: "Give him room to grieve. This is his choice too." }
    ],
    choice: { prompt: "Viktor is down. What will Aurion build from here?", options: [
      { label: "Give the district the truth and let its people choose.", flag: "openSystem", echo: "Freedom is not tidy. It belongs to them anyway.", alignment: "hero", alignmentPoints: 2 },
      { label: "Destroy the grid and impose a temporary emergency council.", flag: "rebuildSystem", echo: "No one person will rule—but the district will live under your emergency plan until the danger passes.", alignment: "antihero", alignmentPoints: 2 },
      { label: "Take permanent control of Apex and rule in their place.", flag: "aurionControl", echo: "You can keep the city safe. You can also decide what safety means for everyone.", alignment: "villain", alignmentPoints: 3 }
    ] },
    nextEcho: "Apex is offline. The city has a chance to choose what comes next."
  },
  {
    chapter: "EPILOGUE / THE REBUILD", title: "A Different Kind of Signal", location: "Rooftop garden · Dusk",
    image: "assets/epilogueBackground.png", stamp: "MISSION STATUS: COMPLETE<br>FUTURE: UNWRITTEN",
    intro: "The rain eases. Mia builds a little drone and names it Liberty. Ryder sketches a softer Aurion mask. The city below is bruised, uncertain, and free to choose its next signal.",
    echo: "What do we call the next mission?",
    hint: "Click the people who made it through. There is still one signal below the city.",
    objectives: ["See what the team is rebuilding", "Listen to Echo", "Check the old Apex vault"],
    spots: [
      { label: "Mia’s drone", x: 28, y: 54, title: "Liberty", text: "Mia sets her little drone on the table. It wobbles, steadies, and finds the open air.", textByPath: {
        hero: "Mia sends Liberty across the new neighborhood relay. For the first time, the district can share a signal without asking a ruler’s permission.",
        antihero: "Mia programs Liberty to publish the emergency council’s orders and countdown to its dissolution. She wants the promise visible to everyone.",
        villain: "Beyond your patrol grid, Mia uses Liberty to carry messages between people resisting your rule."
      }, flag: "liberty", echo: "A good name for something small enough to change direction." },
      { label: "Ryder’s sketchbook", x: 61, y: 48, title: "A softer symbol", text: "Ryder’s sketch of Aurion has no blade and no crown. Just a figure standing beside people, not above them.", textByPath: {
        hero: "Ryder sketches Aurion beside a circle of delegates. No blade, no crown—only a seat that can be given up.",
        antihero: "Ryder sketches a council seal with a clear expiry date. The symbol is a reminder that emergency power must end.",
        villain: "Ryder sketches a resistance mark with no Aurion crest. He refuses to let your image become their symbol."
      }, flag: "sketch", echo: "That is a version of us I would like to become." },
      { label: "Old Apex vault", x: 79, y: 72, title: "A signal that should be dead", text: "Far below the city, a dormant server lights up: REBOOTING… AI INSTANCE: V_KANE_REPLICA_001.", textByPath: {
        hero: "The public audit has already flagged the dormant server. The district can quarantine the replica together—if it survives the night.",
        antihero: "The emergency council’s timer reaches zero as the dormant server wakes. The city will face this threat without your extraordinary powers.",
        villain: "Your control grid detects a rebel-held archive waking the replica. Resistance survived your takeover—and it has Viktor’s old face."
      }, flag: "replica", echo: "That signal is real. The story is not over." }
    ],
    final: true,
    nextEcho: "Ghosts never die. They change form."
  }
];

const musicThemes = [
  { bpm: 72, chords: [["C3", "G3", "D#4"], ["A#2", "F3", "C4"]], bass: ["C2", null, "C2", "G2", "A#1", null, "F2", null], lead: ["G4", null, "D#5", null, "C5", null, "G4", null] },
  { bpm: 78, chords: [["D3", "A3", "C4"], ["A#2", "F3", "C4"]], bass: ["D2", null, "A2", null, "A#1", null, "F2", null], lead: ["A4", null, "C5", "A4", null, "F4", null, "D4"] },
  { bpm: 92, chords: [["E3", "A#3", "D4"], ["C3", "G3", "A#3"]], bass: ["E2", "E2", null, "A#1", "C2", null, "D2", null], lead: ["E5", null, "D5", "A#4", null, "G4", "A#4", null] },
  { bpm: 82, chords: [["C#3", "F#3", "A3"], ["G#2", "C#3", "F3"]], bass: ["C#2", null, "G#1", "C#2", null, "F#1", "G#1", null], lead: ["C#5", null, "A4", null, "F#4", "G#4", null, "C#5"] },
  { bpm: 76, chords: [["F3", "C4", "G4"], ["D#3", "A#3", "F4"]], bass: ["F2", null, "C2", null, "D#2", null, "A#1", null], lead: ["C5", null, "A#4", null, "G4", "F4", null, "D#4"] },
  { bpm: 58, chords: [["G3", "D4", "A4"], ["E3", "B3", "D4"]], bass: ["G2", null, null, "D2", null, null, "E2", null], lead: ["D5", null, null, "B4", null, "A4", null, null] },
  { bpm: 68, chords: [["A3", "E4", "G4"], ["F3", "C4", "E4"]], bass: ["A1", null, "E2", null, "F2", null, "C2", null], lead: ["E5", null, "C5", null, "B4", null, "G4", null] },
  { bpm: 100, chords: [["D3", "A3", "C4"], ["F3", "C4", "E4"]], bass: ["D2", "D2", null, "A1", "F2", null, "C2", "A1"], lead: ["A4", null, "D5", "C5", null, "A4", "F4", null] },
  { bpm: 64, chords: [["C3", "G3", "D4"], ["F3", "C4", "E4"]], bass: ["C2", null, null, "G1", "F2", null, null, "C2"], lead: ["G4", null, null, "D5", null, "C5", null, "A4"] },
  { bpm: 54, chords: [["C3", "G3", "D4", "E4"], ["A2", "E3", "B3", "D4"]], bass: ["C2", null, null, null, "A1", null, "E2", null], lead: ["G4", null, null, "D5", null, null, "E5", null] },
  { bpm: 88, chords: [["F#3", "C#4", "E4"], ["D3", "A3", "C#4"]], bass: ["F#1", null, "C#2", "F#1", "D2", null, "A1", "C#2"], lead: ["C#5", "E5", null, "F#5", "E5", null, "C#5", "A4"] },
  { bpm: 74, chords: [["D#3", "A#3", "C4"], ["G#3", "D#4", "G4"]], bass: ["D#2", null, "A#1", null, "G#1", null, "D#2", null], lead: ["A#4", null, "C5", null, "D#5", null, "G4", null] },
  { bpm: 108, chords: [["A3", "E4", "B4"], ["F3", "C4", "G4"]], bass: ["A1", "A1", "E2", null, "F2", "F2", "C2", null], lead: ["E5", null, "A5", "G5", "E5", null, "C5", "B4"] },
  { bpm: 62, chords: [["C3", "G3", "D4"], ["A#2", "F3", "C4"]], bass: ["C2", null, null, "G1", "A#1", null, null, "F2"], lead: ["G4", null, "D5", null, "C5", null, "A#4", null] }
];

const conversations = [
  [
    { id: "mia", name: "Mia", voice: "secure call", line: "You only call when the city is on fire. Did you ever think I might just want to hear from you?", echo: "She is asking about more than tonight.", replies: [
      { label: "“I should have called. I’m listening now.”", response: "A pause. “Okay. Then listen: Ryder’s in trouble, and I’m scared they’ll use him to get to me.”", trust: { mia: 2 }, outcome: "open", alignment: "hero" },
      { label: "“Tell me the facts. We can talk later.”", response: "“That’s what you always say.” Mia sends Ryder’s location, but the line goes quiet.", trust: { mia: -1 }, outcome: "distant", alignment: "antihero" }
    ] },
    { id: "echo", name: "Echo", voice: "neural link", line: "You heard the hurt in her voice. Do you want me to filter it out, or stay with you while you answer?", echo: "I can calculate a response. I can’t choose what kind of father you want to be.", replies: [
      { label: "“Stay with me. Don’t decide for me.”", response: "“Understood. I’ll keep the channel open and let you speak for yourself.”", trust: { echo: 1 }, outcome: "agency", alignment: "hero" },
      { label: "“Keep me focused on the job.”", response: "“Acknowledged.” Echo lowers her voice, but not the silence that follows.", trust: { echo: -1 }, outcome: "distance", alignment: "antihero" }
    ] }
  ],
  [
    { id: "ryder", name: "Ryder", voice: "at the apartment", line: "You hit me before you asked the right question. Why should I trust you with anything else?", echo: "He is giving you a chance to answer. Don’t make it another interrogation.", replies: [
      { label: "“You’re right. I was wrong to hit you.”", response: "Ryder studies you, then hands over the receiver. “Okay. No more threats. I’ll tell you what I know.”", trust: { ryder: 2 }, outcome: "apology", flag: "ryderApology", alignment: "hero", alignmentPoints: 2 },
      { label: "“Because Mia’s safety is on the line.”", response: "“That’s not an answer.” Ryder gives you the receiver but keeps the rest to himself.", trust: { ryder: -1 }, outcome: "pressure", alignment: "villain" }
    ] },
    { id: "patch", name: "Nia “Patch” Solis", voice: "Ryder’s encrypted contact", line: "Ryder says you’re asking about the scar. I’m Nia Solis. I took that implant out when Q-Source refused to explain what it was doing to him.", echo: "She treated him when the people responsible wouldn’t. Hear her out.", replies: [
      { label: "“Tell me what they did to him.”", response: "“They called it a cognition trial. It was an extraction rehearsal. I kept a copy of the consent logs.”", trust: { patch: 2 }, outcome: "share", flag: "patchConsentLogs", alignment: "hero" },
      { label: "“I can’t involve another civilian.”", response: "“I already am involved. But you don’t get the records until I know Ryder is safe.”", trust: { patch: -1 }, outcome: "withhold", alignment: "antihero" }
    ] }
  ],
  [
    { id: "patch", name: "Nia “Patch” Solis", voice: "back-channel", line: "The receiver’s serial matches the lab equipment I used to work on. If you send me the Q-Source trace, I can tell you what they were building.", echo: "Sharing evidence could put her clinic at risk. Keeping it secret leaves her blind.", replies: [
      { label: "“I trust you. I’m sending the trace.”", response: "“Got it. That’s not a theft beacon—it’s a live extraction trigger. They’re waiting for the drive to open.”", trust: { patch: 2 }, outcome: "share", flag: "patchDecodedBeacon", alignment: "hero" },
      { label: "“Not until I know who else is listening.”", response: "“Fair. I’ll keep the clinic off the network. Call when you’re ready.”", trust: { patch: -1 }, outcome: "hold", alignment: "antihero" }
    ] }
  ],
  [
    { id: "mia", name: "Mia", voice: "apartment intercom", line: "You found the extraction file. Is Echo really part of the target—or are you going to tell me another half-truth?", echo: "She deserves to know what this could cost you.", replies: [
      { label: "“They’re after Echo. It could kill us both.”", response: "Mia goes quiet. “Then we protect both of you. No more deciding what I can handle.”", trust: { mia: 2 }, outcome: "truth", alignment: "hero" },
      { label: "“We don’t know enough to say that yet.”", response: "“You always keep the worst part to yourself.” She stays to help, but watches you carefully.", trust: { mia: -1 }, outcome: "guarded", alignment: "antihero" }
    ] }
  ],
  [
    { id: "arivon", name: "Agent Arivon", voice: "Ghost Protocol channel", line: "The old Aurion suite is still keyed to you. Before I send it, tell me whether Mia knows what the program made you.", echo: "This is the last safe moment to choose honesty over control.", replies: [
      { label: "“She knows the truth. Give her the whole file.”", response: "“Then she gets a choice too.” Arivon sends Mia the unredacted program history and your deployment route.", trust: { arivon: 2, mia: 1 }, outcome: "unredacted", flag: "aurionFileShared", alignment: "hero" },
      { label: "“Keep her out of the classified details.”", response: "“That was your decision last time.” Arivon sends the suit but seals the mission archive.", trust: { arivon: -1 }, outcome: "sealed", alignment: "villain" }
    ] }
  ],
  [
    { id: "echo", name: "Echo", voice: "dream link", line: "When you call me a program, is that because you believe it—or because it’s safer than calling me part of you?", echo: "There isn’t a tactical answer to this one.", replies: [
      { label: "“I don’t know what you are. I know I trust you.”", response: "“That’s enough to begin.” For a moment, the dream stops fracturing.", trust: { echo: 2 }, outcome: "trust", alignment: "hero" },
      { label: "“I need you to remain predictable.”", response: "“I can try.” Echo’s figure fades back into the pale static.", trust: { echo: -1 }, outcome: "control", alignment: "villain" }
    ] }
  ],
  [
    { id: "echo", name: "Echo", voice: "safehouse", line: "You asked me to guide you. Does that mean you want my judgment—or permission to disagree with you?", echo: "A partnership needs room for both of us to be wrong.", replies: [
      { label: "“Challenge me when I’m acting from fear.”", response: "“I will. And you can tell me when my certainty becomes its own kind of fear.”", trust: { echo: 2 }, outcome: "challenge", alignment: "hero" },
      { label: "“Just give me the cleanest answer.”", response: "“I can give you probabilities. The choice will still be yours.”", trust: { echo: -1 }, outcome: "calculate", alignment: "antihero" }
    ] }
  ],
  [
    { id: "patch", name: "Nia “Patch” Solis", voice: "safehouse radio", line: "I’ve treated people on both sides of that SkyCom fence. Your quiet route passes a shelter. If the alarm trips, those families are the first ones trapped.", echo: "The map isn’t just an entry plan. It decides who gets caught in it.", replies: [
      { label: "“We’ll warn the shelter before we move.”", response: "“I’ll get them out through the service tunnel. You’ll have a clean window, and nobody gets left behind.”", trust: { patch: 2 }, outcome: "evacuate", flag: "shelterEvacuated", alignment: "hero", alignmentPoints: 2 },
      { label: "“We can’t risk the mission for a shelter.”", response: "“Then I’ll get them out without your help. Don’t expect them to cover your exit.”", trust: { patch: -2 }, outcome: "refuse", alignment: "villain", alignmentPoints: 2 }
    ] }
  ],
  [
    { id: "mia", name: "Mia", voice: "hidden channel", line: "I can see the vault from here. Are you coming to pull us out, or do you trust us to finish our part?", echo: "She is asking for partnership, not rescue.", replies: [
      { label: "“I trust you. Tell me what you need.”", response: "“Keep the mainframe busy. Ryder and I will open the nerve stack together.”", trust: { mia: 2 }, outcome: "partner", alignment: "hero" },
      { label: "“Stay put. I’ll get you out first.”", response: "“Dad, I’m not cargo.” She’ll follow the plan, but the hurt is back in her voice.", trust: { mia: -1 }, outcome: "rescue", alignment: "antihero" }
    ] },
    { id: "ryder", name: "Ryder", voice: "SkyCom comms", line: "My father built this place. I know the power nexus—but I don’t know if I can face him.", echo: "He needs a person, not a plan.", replies: [
      { label: "“You don’t have to forgive him to stop him.”", response: "“I know. I just wanted one chance to ask why.” Ryder marks the backup route.", trust: { ryder: 2 }, outcome: "resolve", alignment: "hero" },
      { label: "“Keep your head on the objective.”", response: "“Right. Objective.” His voice goes flat, and the channel clicks off.", trust: { ryder: -1 }, outcome: "mission", alignment: "antihero" }
    ] }
  ],
  [
    { id: "arivon", name: "Agent Arivon", voice: "Aurion failsafe", line: "Full synchronization was the last-resort defense. It joins the host and Echo at the level of memory and thought. No owner, no passenger. There is no clean rollback: the memories they make together cannot be separated without losing them.", echo: "He is giving us the truth this time. Ask what the protocol cannot guarantee.", replies: [
      { label: "“Show us every failure report. No more hidden costs.”", response: "“All of them.” Arivon opens the unredacted files. “I can give you an abort channel before the merge locks. After that, I cannot give either of you back your old privacy.”", trust: { arivon: 2 }, outcome: "transparent", flag: "mergeRisksKnown", alignment: "hero" },
      { label: "“No more secrets. Stay on the safety line.”", response: "“Understood.” Arivon keeps the relay open and lets you decide what to read.", trust: { arivon: 1 }, outcome: "boundary", alignment: "antihero" }
    ] },
    { id: "echo", name: "Echo", voice: "neural link", line: "That birthday recording is still yours alone. When we merge, I will feel the shame you hid inside it. You will feel my fear that, when this is over, you’ll see a weapon where Echo used to be. We cannot unshare either truth.", echo: "She is asking you to know her as a person, not only to trust her power.", replies: [
      { label: "“You should know why I stayed away. I won’t hide it.”", response: "“I hear her calling you Daddy. I feel your guilt at every year you stayed away. It hurts—and it is yours, not mine to forgive. I am still choosing you.”", trust: { echo: 2 }, outcome: "sharedShame", flag: "echoMergeConsent", alignment: "hero" },
      { label: "“I’ll share it, but we ask before crossing each boundary.”", response: "“Then we ask, every time. Some things we share can’t be taken back. I choose to know you with my eyes open.”", trust: { echo: 1 }, outcome: "sharedByChoice", flag: "echoMergeConsent", alignment: "hero" }
    ] },
    { id: "patch", name: "Nia “Patch” Solis", voice: "medical relay", line: "I can monitor your vitals and keep sealed copies of both original neural baselines. That helps me treat you if something goes wrong; it cannot reverse the merge or restore memories you share. Do you want the anchor?", echo: "An outside safeguard can help keep you alive. It cannot take this choice back.", replies: [
      { label: "“Keep the baseline and stay on the abort channel.”", response: "“Anchor is live. I’ll watch your vitals and preserve the starting patterns. But once you make new memories together, they belong to both of you.”", trust: { patch: 2 }, outcome: "anchored", flag: "mergeAnchorReady" },
      { label: "“Stay close, but don’t record either baseline.”", response: "“Vitals only. I’ll keep the abort channel open. The rest is yours to share—or not.”", trust: { patch: 1 }, outcome: "vitalsOnly", flag: "mergeVitalsOnly" }
    ] }
  ],
  [
    { id: "viktor", name: "Viktor Kane", voice: "intercepted tower broadcast", line: "You want to call me a tyrant. I watched a city starve when every system failed at once. I built a leash because nobody else would hold the line.", echo: "He believes the harm was necessary. Ask what he is afraid will happen without him.", replies: [
      { label: "“Who were you trying to keep safe?”", response: "“My sister. The ration riots took her before the markets stabilized.” The broadcast cuts, but the confession is on record.", outcome: "confession", flag: "viktorConfession", alignment: "hero" },
      { label: "“You used their fear to make yourself king.”", response: "“And you used a ghost protocol to disappear. We both know what power costs.” He closes the channel.", outcome: "accusation", flag: "viktorAccused", alignment: "antihero" }
    ] }
  ],
  [
    { id: "mia", name: "Mia", voice: "maintenance hub", line: "PHOENIX can free the district, but it will expose everyone who helped us. Do we give the people the truth, even if it puts them in danger?", echo: "There may not be a clean option. There can still be an honest one.", replies: [
      { label: "“Let them choose with the facts.”", response: "“Then we publish the evidence with the names stripped out. People deserve the truth—and their privacy.”", trust: { mia: 2 }, outcome: "publish", alignment: "hero", alignmentPoints: 2 },
      { label: "“Keep the evidence sealed until it’s safe.”", response: "“I’ll protect the names. But don’t ask me to pretend the silence is harmless.”", trust: { mia: -1 }, outcome: "seal", alignment: "antihero" }
    ] },
    { id: "ryder", name: "Ryder", voice: "power-nexus line", line: "If Viktor is still down there, I need to hear him say why. I’m not sure what I’ll do with the answer.", echo: "You can make room for the truth without promising what comes after.", replies: [
      { label: "“Ask him. I’ll stay on the line.”", response: "“Thanks. That’s all I needed.” Ryder opens a private channel to the Mainframe.", trust: { ryder: 2 }, outcome: "hear", alignment: "hero" },
      { label: "“There’s no time for answers.”", response: "“There’s always time for the things you regret not asking.” Ryder goes quiet.", trust: { ryder: -1 }, outcome: "defer", alignment: "antihero" }
    ] }
  ],
  [
    { id: "viktor", name: "Viktor Kane", voice: "Mainframe channel", line: "The city is already breaking. If I surrender, the markets will carve it up before sunrise.", echo: "If you heard his confession, there may be a way to stop him without repeating his rule.", replies: [
      { label: "“Surrender. We’ll put the records before the district.”", response: "Viktor laughs without humor. “You don’t understand the cost of order.” The constructs advance.", responseIf: { flag: "viktorConfession", text: "Viktor lowers his hands. “Then let them judge what I built.” The constructs power down; he will face an open hearing." }, outcome: "accountable", flagIf: { condition: "viktorConfession", yes: "viktorTruce", no: "viktorDefeated" }, alignment: "hero", alignmentPoints: 2 },
      { label: "“This ends now. You don’t get another chance.”", response: "Viktor reaches for the override. Mia’s countermeasure catches him before he can trigger it.", outcome: "force", flag: "viktorDefeated", alignment: "antihero" }
    ] },
    { id: "ryder", name: "Ryder", voice: "open comm", line: "If he gives up, I don’t know if I can stand there and watch him answer for it.", echo: "You can support Ryder without asking him to forgive.", replies: [
      { label: "“You don’t owe him forgiveness. Just be here for yourself.”", response: "Ryder steadies his breathing. “Then I’ll stay. I want to hear the truth, whatever it costs.”", trust: { ryder: 2 }, outcome: "stay", alignment: "hero" },
      { label: "“He’s still your father. Don’t walk away.”", response: "“You don’t get to tell me what I owe him.” Ryder disconnects, but keeps the power route open.", trust: { ryder: -2 }, outcome: "leave", alignment: "antihero" }
    ] }
  ],
  [
    { id: "mia", name: "Mia", voice: "rooftop", line: "You came back. I’m not ready to say everything is fixed—but I want to know what we do now.", echo: "A future can start without pretending the past didn’t happen.", replies: [
      { label: "“We build something together, at your pace.”", response: "Mia smiles, just a little. “Together. But you answer when I call.”", trust: { mia: 2 }, outcome: "rebuild", alignment: "hero" },
      { label: "“I’ll make sure you’re safe. That’s what matters.”", response: "“Safe isn’t the same as heard, Dad.” She lets you stay, but not decide for her.", trust: { mia: -1 }, outcome: "protect", alignment: "antihero" }
    ] },
    { id: "patch", name: "Nia “Patch” Solis", voice: "clinic uplink", line: "The shelter families made it out. They want to turn my clinic into a neighborhood relay—not another system owned by one person.", echo: "The rebuild could belong to the people who need it.", replies: [
      { label: "“I’ll help keep it open and independent.”", response: "“Good. No kings, no hidden owners. Just people keeping each other alive.”", trust: { patch: 2 }, outcome: "community", flag: "neighborhoodRelay", alignment: "hero" },
      { label: "“Let the district handle it. We’ve done enough.”", response: "“You have. The rest is ours.” Patch starts the relay without you.", trust: { patch: 0 }, outcome: "independent", alignment: "hero" }
    ] }
  ]
];

export { evidence, scenes, musicThemes, conversations };

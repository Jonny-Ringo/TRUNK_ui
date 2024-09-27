local json = require("json")

Projects = Projects or {}
ProjectStakers = ProjectStakers or {}
ProjectIdCounter = ProjectIdCounter or 0
ProjectVotes = ProjectVotes or {}

local TRUNK = TRUNK or "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ"

-- VOTER v0.1a: 7QfXjBhW2sU3FJfPJ7t-_Cn8ScoZuzQOPSprNC4q_CE
-- VOTER v0.2a (AO 2.0 Upgrade): h_fyEP9EAj84749UohXWVmEUH24OXgG1t2qPQ41TMsk
-- Voter v0.3a (AO 2.0): aE9x2ta9HRCYeQgP3GRBfLGhGNVj9Im3rv02r3oXCGk
-- Voter v0.4a (AO 2.0): FdEWGam9Jv5l8b5t3a5buqvzIZz8c_Z2oJ4eDnlylt4
-- TRUNK: wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ
-- .load ./process/voter.lua
-- Send({ Target=ao.id, Action="Ping" })

function InitNewProject(name, siteURL, iconURL, stakeAmount, owner)
    return {
        Name = name,
        SiteURL = siteURL,
        IconURL = iconURL,
        Stake = stakeAmount,
        Owner = owner,
        ID = GetNewID(),
    }
end

function InitNewVote(owner, stake, projectId )
    return {
        Stake = stake,
        Owner = owner,
        ID = projectId,
    }
end

function GetNewID()
    ProjectIdCounter = ProjectIdCounter + 1
    return ProjectIdCounter
end

function InitNewProjectStaker( sender, stakeAmount )
    return {
        Owner = sender,
        Stake = stakeAmount
    }
end

local function getStakerJson(sender)
    local jsonData

    if ProjectStakers and type(ProjectStakers) == "table" and #ProjectStakers > 0 then
        local matchedStaker = nil

        for _, staker in ipairs(ProjectStakers) do
            if staker.Owner and staker.Owner == sender then
                matchedStaker = staker
                break
            end
        end

        if matchedStaker then
            local success, encoded = pcall(json.encode, matchedStaker)
            
            if success then
                jsonData = encoded
            else
                jsonData = '{"error": "Failed to encode staker data to JSON."}'
                print("JSON Encoding Error: " .. tostring(encoded))
            end
        else
            jsonData = '{"error": "No matching staker found for the provided sender."}'
            print("No matching staker found for sender: " .. tostring(sender))
        end
    else
        jsonData = '{"error": "No ProjectStakers available."}'
        print("ProjectStakers is empty or not defined.")
    end

    return jsonData
end

local function isSenderInProjects(sender)
    for _, project in ipairs(Projects) do
        if project.Owner and project.Owner == sender then
            return true
        end
    end
    
    return false
end

local function findProjectByID(id)
    for _, project in ipairs(Projects) do
        if project.ID == id then
            return project
        end
    end
    return nil
end

function RegisterVote(projectId, voterAddress, voterAmount)

    local numericProjectId = tonumber(projectId)
    local numericVoterAmount = tonumber(voterAmount)

    print( "RegisterVote: " .. voterAddress ..  "Project ID: " .. numericProjectId .. " Voter Amount: " .. numericVoterAmount )

    if not numericProjectId or not numericVoterAmount then
        print("Error: Invalid projectId or voterAmount. Registration failed.")
        return false
    end

    -- Flag to track if the vote was updated
    local voteUpdated = false

    -- Iterate through ProjectVotes to find an existing vote by voterAddress
    for _, vote in ipairs(ProjectVotes) do

        print( "Vote Owner: " .. vote.Owner .. " vs Voter Address: " .. voterAddress )
        if vote.Owner == voterAddress then
            print("Existing vote found for " .. voterAddress)
            -- Existing vote found, update Stake and ID
            vote.Stake = numericVoterAmount
            vote.ID = numericProjectId
            voteUpdated = true
            print("Vote updated for " .. voterAddress .. ". New Stake: " .. vote.Stake .. ", New Project ID: " .. vote.ID)
            break
        end
    end

    print( "Vote Updated: " .. tostring(voteUpdated) )

    -- If no existing vote found, add a new vote entry
    if not voteUpdated then

        print( "Adding new vote" )
        local newVote = InitNewVote(voterAddress, numericVoterAmount, numericProjectId)
        table.insert(ProjectVotes, newVote)
        print("New vote added for " .. voterAddress .. ". Stake: " .. newVote.Stake .. ", Project ID: " .. newVote.ID)
    end

    return true -- Indicate success
end

function Test( number )
    print("Test: " .. number)
    table.insert( ProjectVotes, tonumber(number) )
end


-- Send({ Target = ao.id, Action = "Add-Project", Name = "Typr", SiteURL = "https://www.typr.day/", IconURL = "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/3741374/179117_641860.jpg", Stake = "1000", Owner = ao.id })
-- Send({ Target = ao.id, Action = "Add-Project", Name = "", SiteURL = "testsite.io", IconURL = "icon.xyz", Stake = "1000", Owner = ao.id })
-- Add Project Handler
Handlers.add(
    "Add-Project",
    Handlers.utils.hasMatchingTag("Action", "Add-Project"),
    function (msg)

        -- Get all the Projects this wallet is the owner of

        -- Check is project is a staker
        local matchedStaker = nil
        local amount = 0
        local hasProject = false;

        for _, staker in ipairs(ProjectStakers) do
            if staker.Owner and staker.Owner == msg.From then
                matchedStaker = staker
                amount = staker.Stake
                break
            end
        end

        -- Check they have enough staked (ignored for now)
        -- print("Staker: " .. matchedStaker.Owner .. " Amount: " .. amount)

        -- Check the staker isnt already a project owner
        hasProject = isSenderInProjects(msg.From)

        if hasProject then
            print("You already have a project")
            Handlers.utils.reply("You already have a project")(msg)
            return
        end


        if matchedStaker and not hasProject then
            -- This will just add the project to the list of projects
            local newProject = InitNewProject(msg.Name, msg.SiteURL, msg.IconURL, matchedStaker.Stake, matchedStaker.Owner)
            print("New Project: " .. newProject.Name)
            table.insert(Projects, newProject)
            Handlers.utils.reply("Project Successfully Added")(msg)
            return
        else
            -- Reject the project addition if not a staker / or not enough staked
            print("No matching staker found for sender: " .. tostring(sender))
            Handlers.utils.reply("No matching staker found for sender: " .. tostring(sender))(msg)
        end

    end
)

Handlers.add(
    "Balance-Response",
    Handlers.utils.hasMatchingTag("Action", "Balance-Response"),
    function(msg)
        CurrentBalance = msg.Tags.Balance
        print("Balance updated: " .. CurrentBalance)
    end
)

function GetTrunkBalance( msg )
    Send({Target = TRUNK, Action = "Balance", Recipient = msg.Owner, 
    Tags = { 
        Response = "Balance-Response"
     }})
    return "0.1"
end

local function tableToString(tbl)
    local result = {}
    for k, v in pairs(tbl) do
        table.insert(result, k .. ": " .. tostring(v))
    end
    return table.concat(result, ", ")
end

-- Send({ Target = ao.id, Action = "Get-Project" })
Handlers.add(
    "Get-Project",
    Handlers.utils.hasMatchingTag("Action", "Get-Project"),
    function (msg)
        local jsonData
        if Projects then
            jsonData = json.encode(Projects)
        else
            jsonData = '{"error": "No Projects available"}'
        end
        
        print("Projects JSON: " .. jsonData)
        Handlers.utils.reply(jsonData)(msg)
    end
)

-- Send({ Target = ao.id, Action = "Get-Top-Projects" })
Handlers.add(
    "Get-Top-Projects",
    Handlers.utils.hasMatchingTag("Action", "Get-Top-Projects"),
    function (msg)
        local jsonData
        if Projects and #Projects > 0 then
            local topProjects = {}
            for i = 1, math.min(3, #Projects) do
                table.insert(topProjects, Projects[i])
            end
            jsonData = json.encode(topProjects)
        else
            jsonData = '{"error": "No Projects available"}'
        end
        print("Top Projects JSON: " .. jsonData)
        Handlers.utils.reply(jsonData)(msg)
    end
)

-- Send({ Target = ao.id, Action = "GetVotes" })
Handlers.add("Get-Votes", "GetVotes", function (msg)
        local jsonData
        if ProjectVotes then
            jsonData = json.encode(ProjectVotes)
        else
            jsonData = '{"error": "No ProjectVotes available"}'
        end
        
        print("ProjectVotes JSON: " .. jsonData)
        Handlers.utils.reply(jsonData)(msg)
    end
)

Handlers.add(
    "Credit-Notice",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice"),
    function (msg)
        
        local actionType = msg["X-[TYPE]"] or ""
        local projectName = msg["X-[NAME]"] or ""
        local iconURL = msg["X-[ICONURL]"] or ""
        local siteURL = msg["X-[SITEURL]"] or ""
        local voteID = tonumber(msg["X-[ID]"]) or 0
        local sender = msg.Sender or "Unknown Sender"
        local quantity = msg.Quantity or 0

        print("Got Trunk: " .. quantity .. " from " .. sender)
        print("Type: " .. actionType .. " For: " .. projectName)

        if actionType == "PROJECT" then
            print("New Project: " .. projectName .. " Icon: " .. iconURL .. " Site: " .. siteURL)

            local success, newProject = pcall(InitNewProject, projectName, siteURL, iconURL, quantity, sender)
            if success then
                table.insert(Projects, newProject)
                Handlers.utils.reply("Project Successfully Added")(msg)
            else
                print("Error initializing new project: " .. newProject)
                Handlers.utils.reply("Failed to add project")(msg)
            end
            
        elseif actionType == "VOTE" then
            print("New Vote: " .. projectName .. " Id: " .. voteID)
            
            -- local project = findProjectByID(voteID)
            
            -- if project then
            --     local success, voteResult = pcall(RegisterVote, project, sender, quantity)
            --     if success and voteResult then
            --         Handlers.utils.reply("Vote Successfully Registered")(msg)
            --     else
            --         print("Error registering vote: " .. (voteResult or "Unknown Error"))
            --         Handlers.utils.reply("Vote Registration Failed")(msg)
            --     end
            -- else
            --     print("Project with ID " .. voteID .. " not found.")
            --     Handlers.utils.reply("Project Not Found")(msg)
            -- end
        else
            print("Unhandled Action Type: " .. actionType)
            Handlers.utils.reply("Unknown Action Type")(msg)
        end
    end
)


Handlers.add(
    "Get-Project-Staker",
    Handlers.utils.hasMatchingTag("Action", "Get-Project-Staker"),
    function(msg)
        
        local matchedStaker = nil

        for _, staker in ipairs(ProjectStakers) do
            if staker.Owner and staker.Owner == msg.From then
                matchedStaker = staker
                break
            end
        end

        if matchedStaker then
            print( "true" );
            Handlers.utils.reply("true")(msg)
        else
            print( "false" );
            Handlers.utils.reply("false")(msg)
        end 

    end
)

-- Handlers.add("Ping", 
--     function(m)
--         Send({ Target="wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ", Action="Balance", Recipient="eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE"})
--         local res = Receive()
--         print("" .. res)
--     end
-- )

-- Handlers.add('boom', 
--   function(msg)
--     Send({ Target="wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ", Action="Balance", Recipient="eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE"})
--         local res = Receive()
--         print("" .. res)
--         msg.reply(res.Data)
--   end
-- )

Handlers.add("Tester-Function", "Test", function (msg)
    Send({Target = ao.id, Data = "53", Shit="Fuck" })
    local res = Receive({Shit = "Fuck"})
    print(res.Data)

    Test( tonumber(res.Data) )
    

    -- local sender = msg.From
    -- print("Sender: " .. sender)

    -- Send({ Target=TRUNK, Action="Balance", Recipient=msg.From})
    -- local res = Receive( {Action="Balance"} )
    -- print( "Balance: ", res.Data)

    -- msg.forward(sender, { Data = res.Data})
    -- msg.reply(res.Data)
end)

Handlers.add("Tester-Staker", "Staker", function (msg)
    local sender = msg.From
    print("Sender: " .. sender)
    Send({ Target=TRUNK, Action="Stakers"})
    local res = Receive( {Action="Stakers"} )
    jsonData = json.encode(res.Data)
    print(jsonData)
    Send({ Target=sender, Action="Stakers", Data ="Hello" })
    -- msg.forward(sender, { Data = jsonData})
    msg.reply(jsonData)
end)


Handlers.add("Greeting-Name", { Action = "Greeting"}, function (msg)
    msg.reply({Data = "Hello " .. msg.Data or "bob"})
    print('server: replied to ' .. msg.Data or "bob")
end)

Handlers.add("Project-Vote", "Vote", function (msg)
    
    local projectId = tonumber(msg["ID"]) or 0
    local address = msg.From or "Unknown Sender"
    print("Voter: " .. address .. " ProjectID: " .. projectId) 

    Send({ Target=TRUNK, Action="Balance", Recipient=address, Sender=ao.id })
    local res = Receive( { Target=ao.id, From=TRUNK, Account=address} )
    local balance = res.Data or 0
    print(balance .. " for " .. address)
    
    -- Test( res.Data )s
    RegisterVote(projectId, address, res.Data)

    -- Send({Target = ao.id, Data = "53", Shit="Fuck" })
    -- local res = Receive({Shit = "Fuck"})
    -- print(res.Data)

    -- Test( tonumber(res.Data) )

    -- Test( res.Data )

    -- local quantity = res.Data or 0

    

    -- table.insert(ProjectVotes, quantity )
    
    -- local project = findProjectByID(voteID)
            
    -- if project then
    --     local success, voteResult = pcall(RegisterVote, project, sender, quantity)
    --     if success and voteResult then
    --         print("Vote Successfully Registered: " .. quantity .. " for " .. project.Name)
    --     else
    --         print("Error registering vote: " .. (voteResult or "Unknown Error"))
    --     end
    -- else
    --     print("Project with ID " .. voteID .. " not found.")
    -- end
    
    -- print( "Balance: ", res.Data)

end)

-- Working w/ v0.2a 
-- Handlers.prepend( "Ping",.load ./process/voter.lua
--   Handlers.utils.hasMatchingTag("Action", "Ping"),
--   function(m)

--     Send({ Target="wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ", Action="Balance", Recipient="eqWPXgEngDqBptVFmSlJT0YC9wgyAD4U8l1wrqKu_WE"})
--     local res = Receive()
--     print("" .. res)

--   end
-- )

-- ToDo:
-- Remove Project By Admin Handler (make sure its this ao process)
-- Remove Project By Owner Handler
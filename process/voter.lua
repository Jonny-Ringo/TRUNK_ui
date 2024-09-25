local json = require("json")

local Projects = Projects or {}
local ProjectStakers = ProjectStakers or {}
local ProjectIdCounter = ProjectIdCounter or 0

local ProjectVotes = ProjectVotes or {}

local TRUNK = TRUNK or "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ"

-- VOTER: 7QfXjBhW2sU3FJfPJ7t-_Cn8ScoZuzQOPSprNC4q_CE
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
        Votes = {},
        ID = GetNewID(), --Give the projects its own id
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

        

        -- Send({Target = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ", Action = "Balance"})
        
        -- local _balance = msg.Data
        -- print("Balance: " .. _balance)
        
        -- local balance_number = tonumber(_balance)

        -- if( balance_number < 0.1 ) then
        --     Handlers.utils.reply("Insufficient Balance")(msg)
        -- else
        --     local newProject = InitNewProject(msg.Name, msg.SiteURL, msg.IconURL, msg.Stake, msg.Owner)
        --     print("New Project: " .. newProject.Name)
        --     -- table.insert(Projects, newProject)
        --     Handlers.utils.reply("Project Added: " .. msg.Name)(msg)
        -- end
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
local json = require("json")

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

-- Got Some Trunk
Handlers.add(
    "Credit-Notice",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice"),
    function (msg)

        local newStaker = InitNewProjectStaker(msg.Sender, msg.Quantity)
        table.insert(ProjectStakers, newStaker)
        
        print("Got some trunk: " .. msg.Quantity .. " from " .. msg.Sender)
        Handlers.utils.reply("Got some trunk")(msg)
    end
)

Handlers.add(
    "Get-Project-Staker",
    Handlers.utils.hasMatchingTag("Action", "Get-Project-Staker"),
    function(msg)
        
        -- Check is project is a staker
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



-- Vote Handler

-- Remove Votes Handler

-- Must add "CronTick" handler for cron to work

-- Remove Project By Admin Handler (make sure its this ao process)
-- Remove Project By Owner Handler
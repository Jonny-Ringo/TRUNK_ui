local json = require("json")

Projects = Projects or {}
ProjectStakers = ProjectStakers or {} 
ProjectIdCounter = ProjectIdCounter or 0
ProjectVotes = ProjectVotes or {}

local TRUNK = TRUNK or "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ" -- Trunk 2.0

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

local function isSenderInProjects(sender)
    for _, project in ipairs(Projects) do
        if project.Owner and project.Owner == sender then
            return true
        end
    end
    
    return false
end

function RegisterVoteForProject( projectId, voterAddress )

    local numericProjectId = tonumber(projectId)

    print( "RegisterVote: " .. voterAddress ..  "Project ID: " .. numericProjectId )

    if not numericProjectId then
        print("Error: Invalid projectId or voterAmount. Registration failed.")
        return false
    end

    local voteUpdated = false

    for _, vote in ipairs(ProjectVotes) do

        if vote.Owner == voterAddress then
            vote.ID = numericProjectId
            voteUpdated = true
            print("Vote updated for " .. voterAddress .. ", New Project ID: " .. vote.ID)
            break
        end
    end

    if not voteUpdated then
        local newVote = InitNewVote(voterAddress, 0, numericProjectId)
        table.insert(ProjectVotes, newVote)
        print("New vote added for " .. voterAddress .. ", Project ID: " .. newVote.ID)
    end

    return true
end

function RegisterBalanceForProject( voterAmount, voterAddress )

    local numericVoterAmount = tonumber(voterAmount)

    print( "RegisterVote: " .. voterAddress .. " Voter Amount: " .. numericVoterAmount )

    if not numericVoterAmount then
        print("Error: Invalid projectId or voterAmount. Registration failed.")
        return false
    end

    local voteUpdated = false

    for _, vote in ipairs(ProjectVotes) do

        if vote.Owner == voterAddress then
            vote.Stake = numericVoterAmount
            voteUpdated = true
            print("Vote updated for " .. voterAddress .. ". New Stake: " .. vote.Stake)
            break
        end
    end

    if not voteUpdated then
        print("No vote found for " .. voterAddress)
    end

    return true
end

Handlers.add(
    "Add-Project",
    Handlers.utils.hasMatchingTag("Action", "Add-Project"),
    function (msg)

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

        hasProject = isSenderInProjects(msg.From)

        if hasProject then
            print("You already have a project")
            Handlers.utils.reply("You already have a project")(msg)
            return
        end


        if matchedStaker and not hasProject then
            local newProject = InitNewProject(msg.Name, msg.SiteURL, msg.IconURL, matchedStaker.Stake, matchedStaker.Owner)
            print("New Project: " .. newProject.Name)
            table.insert(Projects, newProject)
            Handlers.utils.reply("Project Successfully Added")(msg)
            return
        else
            print("No matching staker found for sender: " .. tostring(sender))
            Handlers.utils.reply("No matching staker found for sender: " .. tostring(sender))(msg)
        end

    end
)

-- Trunk 1.0
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

Handlers.add(
    "Get-Sorted-Project",
    Handlers.utils.hasMatchingTag("Action", "Get-Sorted-Project"),
    function (msg)
        local jsonData

        if Projects and #Projects > 0 then
            local stakeMap = {}
            for _, vote in ipairs(ProjectVotes) do
                local projectId = vote.ID
                if projectId then
                    stakeMap[projectId] = (stakeMap[projectId] or 0) + vote.Stake
                else
                    print("Warning: Vote with missing Project ID encountered.")
                end
            end

            local projectsWithTotalStake = {}
            for _, project in ipairs(Projects) do
                local totalStake = stakeMap[project.ID] or 0
                table.insert(projectsWithTotalStake, {
                    project = project,
                    totalStake = totalStake
                })
            end

            table.sort(projectsWithTotalStake, function(a, b)
                return a.totalStake > b.totalStake
            end)

            local sortedProjects = {}
            for _, entry in ipairs(projectsWithTotalStake) do
                local projectWithStake = {}
                for key, value in pairs(entry.project) do
                    projectWithStake[key] = value
                end
                projectWithStake.Stake = entry.totalStake
                table.insert(sortedProjects, projectWithStake)
            end

            jsonData = json.encode(sortedProjects)
        else
            jsonData = '{"error": "No Projects available"}'
        end

        print("Sorted Projects JSON: " .. jsonData)

        Handlers.utils.reply(jsonData)(msg)
    end
)

-- Trunk 2.0
Handlers.add(
    "Get-Top-Projects",
    Handlers.utils.hasMatchingTag("Action", "Get-Top-Projects"),
    function (msg)
        local jsonData

        if Projects and #Projects > 0 then
            local stakeMap = {}
            for _, vote in ipairs(ProjectVotes) do
                local projectId = vote.ID
                if projectId then
                    stakeMap[projectId] = (stakeMap[projectId] or 0) + vote.Stake
                end
            end

            local projectsWithTotalStake = {}
            for _, project in ipairs(Projects) do
                local totalStake = stakeMap[project.ID] or 0
                table.insert(projectsWithTotalStake, {
                    project = project,
                    totalStake = totalStake
                })
            end

            table.sort(projectsWithTotalStake, function(a, b)
                return a.totalStake > b.totalStake
            end)

            local topProjects = {}
            for i = 1, math.min(3, #projectsWithTotalStake) do
                table.insert(topProjects, projectsWithTotalStake[i].project)
            end

            jsonData = json.encode(topProjects)
        else
            jsonData = '{"error": "No Projects available"}'
        end

        print("Top Projects JSON: " .. jsonData)

        Handlers.utils.reply(jsonData)(msg)
    end
)

-- Trunk 1.0
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
            
        -- This is not used anymore
        elseif actionType == "VOTE" then
            print("New Vote: " .. projectName .. " Id: " .. voteID)
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

Handlers.add("Send-Project-Vote", "SendProjectVote", function (msg)
    
    local projectId = tonumber(msg["PROJECTID"]) or 0
    local address = msg.From or "Unknown Sender"
    print("Voter: " .. address .. " ProjectID: " .. projectId) 

    -- Insert the projects id into the table
    RegisterVoteForProject(projectId, address)

    Send({ Target=TRUNK, Action="Balance", Recipient=address, Sender=ao.id })
    local res = Receive( { Target=ao.id, From=TRUNK, Account=address} )
    local balance = res.Data or 0
    print(balance .. " for " .. address)

    -- Then insert the balance into the table
    RegisterBalanceForProject(balance, address)
end)

-- ToDo:
-- Remove Project By Admin Handler
-- Remove Project By Owner Handler
-- Let Project Owner edit project details
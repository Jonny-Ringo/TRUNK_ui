Projects = Projects or {}
ProjectStakers = ProjectStakers or {}

ProjectIdCounter = ProjectIdCounter or 0

-- aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4
-- .load ./process/voter.lua

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

function InitNewProjectStaker( owner, stakeAmount )
    return {
        Owner = owner,
        Stake = stakeAmount
    }
end

-- Send({ Target = ao.id, Action = "Add-Project", Name = "Typr", SiteURL = "https://www.typr.day/", IconURL = "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/3741374/179117_641860.jpg", Stake = "1000", Owner = ao.id })
-- Send({ Target = ao.id, Action = "Add-Project", Name = "", SiteURL = "testsite.io", IconURL = "icon.xyz", Stake = "1000", Owner = ao.id })
-- Add Project Handler
Handlers.add(
    "Add-Project",
    Handlers.utils.hasMatchingTag("Action", "Add-Project"),
    function (msg)

        local newProject = InitNewProject(msg.Name, msg.SiteURL, msg.IconURL, msg.Stake, msg.ProjectOwner)
        print("New Project: " .. newProject.Name)
        table.insert(Projects, newProject)
        Handlers.utils.reply("Project Added: " .. msg.Name)(msg)

        -- Send({Target = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww", Action = "Balance"})
        
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
    Send({Target = "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww", Action = "Balance", Recipient = msg.Owner, 
    Tags = { 
        Response = "Balance-Response"
     }})
    return "0.1"
end

-- Send({ Target = ao.id, Action = "Get-Project" })
Handlers.add(
    "Get-Project",
    Handlers.utils.hasMatchingTag("Action", "Get-Project"),
    function (msg)
        Send({ Target = msg.From, Data = Projects })
        -- print("Projects " .. Projects)
        -- Handlers.utils.reply("All Projects " .. Projects)(msg)
    end
)

-- Testing Handler
Handlers.add(
    "Ping",
    Handlers.utils.hasMatchingTag("Action", "Ping"),
    function (msg)
        Send({ Target = msg.From, Action = "Removed", Data = "PingyPongy" })
    end
)

-- Got Some Trunk
Handlers.add(
    "Credit-Notice",
    Handlers.utils.hasMatchingTag("Action", "Credit-Notice"),
    function (msg)

        local newStaker = InitNewProjectStaker(msg.Sender, msg.Quantity)
        table.insert(ProjectStakers, newStaker)
        
        print("Got some trunk: " .. msg.Quantity)
        Handlers.utils.reply("Got some trunk")(msg)
    end
)


-- Vote Handler

-- Remove Votes Handler

-- Must add "CronTick" handler for cron to work

-- Remove Project By Admin Handler (make sure its this ao process)
Handlers.add(
    "Revoke-Project",
    Handlers.utils.hasMatchingTag("Action", "Revoke-Project"),
    function (msg)
        if msg.From == "aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4" then

            local _found = false
            
            for i, project in ipairs(Projects) do
                if project.ID == tonumber(msg.ProjectID) then
                    
                    table.remove(Projects, i)

                    _found = true
                    
                    -- Notify the owner of the project that their project has been revoked
                    Send({ Target = project.Owner, Data = "Project Revoked: " .. project.Name })
                    
                    Handlers.utils.reply("Project Revoked: " .. project.Name)(msg)
                    
                    break
                end
            end

            if not _found then
                Handlers.utils.reply("Project not found")(msg)
            end

        else
            Handlers.utils.reply("Unauthorized")(msg)
        end
    end
)


-- Remove Project By Owner Handler
Handlers.add(
    "Remove-Project",
    Handlers.utils.hasMatchingTag("Action", "Remove-Project"),
    function (msg)
        if msg.Owner == "OT9qTE2467gcozb2g8R6D6N3nQS94ENcaAIJfUzHCww" then
            for i, project in ipairs(Projects) do
                if project.ID == msg.ID then
                    table.remove(Projects, i)
                    Handlers.utils.reply("Project Removed: " .. project.Name)(msg)
                    break
                end
            end
        else
            Handlers.utils.reply("Unauthorized")(msg)
        end
    end
)